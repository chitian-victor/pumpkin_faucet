import { useContractContext } from "@/components/context";
import { ethers } from 'ethers';
import { Github, Tv,LogOut } from 'lucide-react';

export default function Nav(){
const {
    account,
    setAccount,
    setError,
    setProvider,
    setSuccessMsg,
    fetchContractData
  } = useContractContext();

// --- 1. 连接钱包 ---
  const connectWallet = async () => {
    if (!window.ethereum) {
      setError('请安装 MetaMask!');
      return;
    }
    try {
      const _provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await _provider.getSigner();
      const _account = await signer.getAddress();

      setProvider(_provider);
      setAccount(_account);
      setError('');

      // 连接后立即获取数据
      fetchContractData(_provider, _account);
    } catch (err: any) {
      setError(err.message || '连接失败');
    }
  };

  // --- 2. 断开连接功能 ---
  const disconnectWallet = () => {
    setAccount(""); // 清空账户地址
    setProvider(null); // 清空 Provider
    setSuccessMsg(''); // 清空成功消息
    setError(''); // 清空错误消息
    // 注意：这不会真正关闭 MetaMask 的授权，只是让 DApp 回到“未登录”状态
  };
  
  return (<div className="bg-[#0f172a] text-slate-200 selection:bg-orange-500/30">
      {/* --- 1. Navigation Bar --- */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-900/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <span className="text-2xl">🎃</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-400 to-yellow-200">
              Pumpkin Faucet
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            {/* GitHub 链接 */}
            <a 
              href="https://github.com/chitian-victor" 
              target="_blank" 
              className="hover:text-orange-400 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Github size={20} /> <span className="hidden sm:inline">GitHub</span>
            </a>
            {/* Bilibili 链接 */}
            <a 
              href="https://space.bilibili.com/51815484" 
              target="_blank" 
              className="hover:text-pink-400 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Tv size={20} /> <span className="hidden sm:inline">Bilibili</span>
            </a>
            
            {/* 钱包连接状态（复用之前的按钮逻辑） */}
            {!account ? (
              <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-600 px-4 py-1.5 rounded-full text-sm font-bold transition-all shadow-lg shadow-orange-500/20">
                Connect
              </button>
            ) : (
              <button 
                onClick={disconnectWallet}
                className="bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white px-4 py-2 rounded-full md:rounded-l-none md:rounded-r-full border border-red-500/50 transition-all flex items-center gap-1 text-xs font-bold"
                title="Disconnect"
              >
                <LogOut size={14} />
                <span>Disconnect</span>
              </button>
            )}
          </div>
        </div>
      </nav>
    </div>
    );
}