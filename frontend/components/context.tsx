import { createContext, useContext, useState,ReactNode } from 'react';

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
}

const ContractContext = createContext<AppContextType>({} as AppContextType);
export const useContractContext = () => useContext(ContractContext);

export function ContractContextProvider({ children }:{children: ReactNode}) {
  // todo-hs 支持自定义输入地址
  const testfaucetAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

  const [account, setAccount] = useState(""); 

  const [tokenAddress, setTokenAddress] = useState('');
  const [faucetAddress, setFaucetAddress] = useState(testfaucetAddress);
  const [dripInterval, setDripInterval] = useState<number>(0);
  const [dripLimit, setDripLimit] = useState<number>(0);

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
      }}
    >
      {children}
    </ContractContext.Provider>
  );
};
