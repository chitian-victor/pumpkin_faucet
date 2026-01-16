
import { useState, useEffect } from 'react';
import { useContractContext } from "@/components/context";
import { ethers, Contract } from 'ethers';
import { Clock, Coins, AlertCircle, CheckCircle, Droplets } from 'lucide-react';
import faucetABI from '../contracts/PumpkinFaucet.json';
import clsx from 'clsx';

export default function FaucetPage() {
  const {
    account,
    faucetAddress,
    tokenAddress,
    dripInterval,
    dripLimit,
    error,
    setError,
    provider,
    tokenSymbol,
    lastClaimTime,
    nextClaimTime,
    fetchContractData
  } = useContractContext();

  // --- 状态定义 ---
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [claimable, setClaimable] = useState(false);

  // --- 领取代币 ---
  const handleClaim = async () => {
    if (!provider || !account) return;
    setLoading(true);
    setError('');
    setSuccessMsg('');
    const dripAmountWei = ethers.parseUnits(
      dripLimit.toString(),
      "ether"
    );
    try {
      const signer = await provider.getSigner();
      const faucetWithSigner = new Contract(faucetAddress, faucetABI.abi, signer);

      const tx = await faucetWithSigner.drip(dripAmountWei);
      setSuccessMsg('交易已发送，等待确认...');

      await tx.wait(); // 等待上链

      setSuccessMsg(`成功领取 ${dripLimit} ${tokenSymbol}!`);
      // 刷新数据
      fetchContractData(provider, account);
    } catch (err: any) {
      // 解析 Ethers 错误
      console.log("claim failed, err:", err);
      if (err.reason) setError(err.reason);
      else setError("领取失败，可能未到冷却时间或水龙头余额不足");
    } finally {
      setLoading(false);
    }
  };

  // --- 倒计时更新 ---
  useEffect(() => {
    if (!nextClaimTime) {
      setClaimable(true);
      return;
    }
    setClaimable(new Date() >= nextClaimTime);
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = nextClaimTime.getTime();
      const diff = Math.floor((target - now) / 1000);
      if (diff <= 0) {
        clearInterval(timer);
      }
      // 如果时间差大于0，更新剩余时间；否则归零
      setClaimable(diff > 0 ? false : true);
    }, 1000);

    // 清除定时器，防止内存泄漏
    return () => {
      clearInterval(timer);
    }
  }, [nextClaimTime]);

  // --- 辅助：时间格式化 ---
  const formatTime = (timestamp: number) => {
    if (timestamp === 0) return '从未领取';
    return new Date(timestamp * 1000).toLocaleString();
  };

  const formatDuration = (seconds: number) => {
    if (seconds <= 0) return '0 秒';
    if (seconds < 60) return `${seconds} 秒`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return secs > 0 ? `${mins}分 ${secs}秒` : `${mins} 分钟`;
    }
    const hours = (seconds / 3600).toFixed(1);
    return `${hours} 小时`;
  };

  // --- UI 渲染 ---
  return (
    <main className="flex-1 bg-[#0f172a] text-white pt-24 pb-12 flex flex-col items-center">      <div className="max-w-2xl w-full bg-slate-800/50 backdrop-blur-md border border-slate-700 rounded-2xl p-8 shadow-xl">

      {/* 头部 */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-400 flex items-center gap-2">
          <Droplets className="text-orange-400" /> 领取信息
        </h1>
        <div className="px-4 py-2 bg-slate-700 rounded-lg text-sm text-slate-300 font-mono border border-slate-600">
          {account.slice(0, 6)}...{account.slice(-4)}
        </div>
      </div>

      {/* 核心状态面板 */}
      {account && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <InfoCard icon={<Coins />} label="每次领取数量" value={`${dripLimit} ${tokenSymbol}`} />
          <InfoCard icon={<Clock />} label="领取冷却间隔" value={formatDuration(dripInterval)} />
          <InfoCard icon={<CheckCircle />} label="上次领取时间" value={formatTime(lastClaimTime)} />
          <InfoCard
            icon={<AlertCircle />}
            label="下次可用时间"
            value={nextClaimTime ? nextClaimTime.toLocaleString() : '现在'}
            highlight={claimable}
          />
        </div>
      )}

      {/* 反馈信息 */}
      {error && (
        <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 text-red-200 rounded-lg text-sm">
          ❌ {error}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-4 bg-green-900/30 border border-green-500/50 text-green-200 rounded-lg text-sm">
          ✅ {successMsg}
        </div>
      )}

      {/* 领取按钮 */}
      <div className="text-center">
        <button
          disabled={!account || loading || !claimable}
          onClick={handleClaim}
          className={clsx(
            'w-full py-4 rounded-xl text-xl font-bold transition-all',
            !account && 'bg-slate-700 text-slate-500 cursor-not-allowed',
            account && loading && 'bg-orange-600/50 cursor-wait',
            account && !loading && !claimable && 'bg-slate-600 text-slate-400 cursor-not-allowed',
            account && !loading && claimable && 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:scale-[1.02] shadow-lg shadow-orange-500/20'
          )}
        >
          {loading ? '交互中...' :
            !account ? '请先连接钱包' :
              !claimable ? '冷却中...' :
                '🎃 立即领取'}
        </button>
      </div>

      {/* 底部详细信息 */}
      {account && (
        <div className="mt-8 pt-6 border-t border-slate-700 text-xs text-slate-500 font-mono space-y-2">
          <div className="flex justify-between">
            <span>Faucet Address:</span>
            <span>{faucetAddress}</span>
          </div>
          <div className="flex justify-between">
            <span>Token Address:</span>
            <span>{tokenAddress}</span>
          </div>
        </div>
      )}
    </div>
    </main>
  );
}

// 简单组件封装
function InfoCard({ icon, label, value, highlight = false }: any) {
  return (
    <div className={`p-4 rounded-xl border ${highlight ? 'bg-green-900/20 border-green-500/30' : 'bg-slate-700/30 border-slate-600'}`}>
      <div className="flex items-center gap-2 text-slate-400 mb-1 text-sm">
        {icon} {label}
      </div>
      <div className={`text-lg font-semibold ${highlight ? 'text-green-400' : 'text-slate-200'}`}>
        {value}
      </div>
    </div>
  )
}