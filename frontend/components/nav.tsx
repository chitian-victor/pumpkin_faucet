import { useState, useEffect } from 'react';
import { useContractContext } from "@/components/context";
import clsx from 'clsx';

export default function Nav(){
const {
    account,
    setAccount,
    faucetAddress,
    tokenAddress,
    setTokenAddress,
    dripInterval,
    setDripInterval,
    dripLimit,
    setDripLimit,

  } = useContractContext();


  
  return <div className="min-h-screen flex flex-col bg-[#0f172a] text-slate-200 selection:bg-orange-500/30">
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
              href="https://github.com/你的用户名" 
              target="_blank" 
              className="hover:text-orange-400 transition-colors flex items-center gap-1 text-sm font-medium"
            >
              <Github size={20} /> <span className="hidden sm:inline">GitHub</span>
            </a>
            {/* Bilibili 链接 */}
            <a 
              href="https://space.bilibili.com/你的UID" 
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
              <div className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 text-xs font-mono">
                {account.slice(0, 6)}...
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
}