import { createContext, useContext, useState,ReactNode } from 'react';
import { BrowserProvider } from 'ethers';
import { ethers, Contract } from 'ethers';
import faucetABI from '../contracts/PumpkinFaucet.json';
import tokenABI from '../contracts/PumpkinToken.json';

type AppContextType = {
        account: string;
        setAccount: (accounts: string) => void;

        tokenAddress: string;
        setTokenAddress: (address: string) => void;
        faucetAddress: string;
        setFaucetAddress: (address: string) => void;
        dripInterval: number;
        setDripInterval: (interval: number) => void;
        dripLimit: number;
        setDripLimit: (limit: number) => void;
        lastClaimTime: number;
        setLastClaimTime: (time: number) => void;
        nextClaimTime: Date | null;
        setNextClaimTime: (time: Date | null) => void;

        error: string;
        setError: (error: string) => void;
        provider: BrowserProvider | null;
        setProvider: (provider: BrowserProvider | null) => void;
        tokenSymbol: string;
        setTokenSymbol: (symbol: string) => void;
  
        fetchContractData: (_provider: BrowserProvider, _user: string) => Promise<void>;
}

const ContractContext = createContext<AppContextType>({} as AppContextType);
export const useContractContext = () => useContext(ContractContext);

export function ContractContextProvider({ children }:{children: ReactNode}) {
  const pumpkinFaucetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [account, setAccount] = useState(""); 
  // --- 合约信息 ---
  const [tokenAddress, setTokenAddress] = useState('');
  const [faucetAddress, setFaucetAddress] = useState(pumpkinFaucetAddress);
  const [dripInterval, setDripInterval] = useState<number>(0);
  const [dripLimit, setDripLimit] = useState<number>(0);
  const [lastClaimTime, setLastClaimTime] = useState(0); // 时间戳
  const [nextClaimTime, setNextClaimTime] = useState<Date | null>(null);

  // --- 状态定义 ---
  const [error, setError] = useState('');
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [tokenSymbol, setTokenSymbol] = useState('');

// --- 2. 读取合约数据 ---
  const fetchContractData = async (_provider: BrowserProvider, _user: string) => {
    try {
      const faucetContract = new Contract(faucetAddress, faucetABI.abi, _provider);

      // 并行请求数据以提高速度
      const [tokenAddr, amt, intv, lastClaim] = await Promise.all([
        faucetContract.token(),
        faucetContract.dripLimit(),
        faucetContract.dripInterval(),
        faucetContract.lastDripTime(_user)
      ]);
      // 获取代币符号
      const tokenContract = new Contract(tokenAddr, tokenABI.abi, _provider);
      const sym = await tokenContract.symbol();
      const dec = await tokenContract.decimals();

      setTokenAddress(tokenAddr);
      setTokenSymbol(sym);
      setDripLimit(Number(ethers.formatUnits(amt, dec))); // 格式化代币数量
      setDripInterval(Number(intv));
      setLastClaimTime(Number(lastClaim));

      // 计算下次领取时间
      if (Number(lastClaim) > 0) {
        const nextTime = new Date((Number(lastClaim) + Number(intv)) * 1000);
        setNextClaimTime(nextTime);
      } else {
        setNextClaimTime(new Date()); // 如果从未领取，则立即可领
      }

    } catch (err: any) {
      console.error(err);
      setError('读取合约数据失败，请检查网络或合约地址');
    }
  };

return (
    <ContractContext.Provider
      value={{
        account,
        setAccount,

        tokenAddress,
        setTokenAddress,
        faucetAddress,
        setFaucetAddress,
        dripInterval,
        setDripInterval,
        dripLimit,
        setDripLimit,
        lastClaimTime,
        setLastClaimTime,
        nextClaimTime,
        setNextClaimTime,

        error,
        setError,
        provider,
        setProvider,
        tokenSymbol,
        setTokenSymbol,

        fetchContractData
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
