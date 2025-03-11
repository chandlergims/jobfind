'use client';

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const walletAddress = "AEnb3z3o8NoVH5r7ppVWXw2DCu84S8n1L5MsP1Hpz5wT";
  const truncatedAddress = `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const connectWallet = () => {
    // In a real app, this would connect to Phantom wallet
    setWalletConnected(true);
  };

  const disconnectWallet = () => {
    setWalletConnected(false);
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-white text-gray-800 p-4 shadow-sm">
      <div className="w-full px-4 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          TrenchedIn
        </Link>
        <div className="relative">
          {walletConnected ? (
            <>
              <button 
                onClick={toggleDropdown}
                className="flex items-center gap-2 overflow-hidden rounded-md border border-[#f0b90b] text-[#f0b90b] h-8 text-sm px-2"
                style={{ fontFamily: 'var(--font-geist-mono)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                </svg>
                <span className="truncate max-w-[120px]" title={walletAddress}>
                  {truncatedAddress}
                </span>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto size-4">
                  <path d="m7 15 5 5 5-5"></path>
                  <path d="m7 9 5-5 5 5"></path>
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 min-w-48 rounded-lg overflow-hidden border border-gray-200 bg-white p-1 text-gray-800 shadow-md z-50"
                  style={{ fontFamily: 'var(--font-geist-mono)' }}
                >
                  <div className="p-2">
                    <div className="flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#f0b90b]">
                        <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                        <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                      </svg>
                      <span className="text-sm">{truncatedAddress}</span>
                    </div>
                  </div>
                  <div className="-mx-1 my-1 h-px bg-gray-200"></div>
                  <div className="p-2">
                    <button 
                      className="flex items-center gap-2 text-sm w-full text-left"
                      onClick={disconnectWallet}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" x2="9" y1="12" y2="12"></line>
                      </svg>
                      <span>Log out</span>
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <button 
              onClick={connectWallet}
              className="flex items-center gap-2 overflow-hidden rounded-md border border-[#f0b90b] text-[#f0b90b] h-8 text-sm px-2"
              style={{ fontFamily: 'var(--font-geist-mono)' }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4">
                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
              </svg>
              <span>Connect Wallet</span>
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
