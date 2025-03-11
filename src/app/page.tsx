'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { isAuthenticated, user, login, logout } = useAuth();
  
  return (
    <div className="flex flex-col items-center mt-25 h-full">
      <div className="flex flex-col items-center space-y-8">
        <img 
          src="/logo.png" 
          alt="Logo" 
          className="w-20 h-20" 
        />
        <h1 className="text-2xl font-semibold text-black" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>
          Welcome to TrenchedIn
        </h1>
        <p className="text-center text-gray-600" style={{ fontFamily: 'var(--font-dm-mono), monospace' }}>
          Centralized hub connecting talent with opportunity
        </p>
        {/* Removed the "Connect your wallet" text as requested */}
        
        <div className="grid grid-cols-2 gap-4 mt-8">
          <Link href="/jobs" className="block">
            <button className="whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral-200 hover:bg-neutral-200/50 hover:text-neutral-900 px-4 py-2 flex items-center gap-2 text-sm text-neutral-600 h-fit justify-start cursor-pointer w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                  <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                </svg>
                <p className="text-md font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Jobs</p>
              </div>
              <p className="text-xs text-neutral-600 hidden md:block" style={{ fontFamily: 'var(--font-dm-mono)' }}>Find your next opportunity</p>
            </div>
          </button>
          
          </Link>
          
          <Link href="/jobs?createJob=true" className="block">
            <button className="whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral-200 hover:bg-neutral-200/50 hover:text-neutral-900 px-4 py-2 flex items-center gap-2 text-sm text-neutral-600 h-fit justify-start cursor-pointer w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M12 8v8"></path>
                  <path d="M8 12h8"></path>
                </svg>
                <p className="text-md font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Create Job</p>
              </div>
              <p className="text-xs text-neutral-600 hidden md:block" style={{ fontFamily: 'var(--font-dm-mono)' }}>Post a new job listing</p>
            </div>
          </button>
          </Link>
          
          <Link href="/profile" className="block">
            <button className="whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral-200 hover:bg-neutral-200/50 hover:text-neutral-900 px-4 py-2 flex items-center gap-2 text-sm text-neutral-600 h-fit justify-start cursor-pointer w-full">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
                <p className="text-md font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Profile</p>
              </div>
              <p className="text-xs text-neutral-600 hidden md:block" style={{ fontFamily: 'var(--font-dm-mono)' }}>Manage your profile</p>
            </div>
          </button>
          
          </Link>
          
          {isAuthenticated ? (
            <button 
              onClick={logout}
              className="whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral-200 hover:bg-neutral-200/50 hover:text-neutral-900 px-4 py-2 flex items-center gap-2 text-sm text-neutral-600 h-fit justify-start cursor-pointer w-full"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                    <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                  </svg>
                  <p className="text-md font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Wallet Manager</p>
                </div>
                <p className="text-xs text-neutral-600 hidden md:block" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  {user?.walletAddress ? `${user.walletAddress.substring(0, 6)}...${user.walletAddress.substring(user.walletAddress.length - 4)}` : 'Manage your wallet'}
                </p>
              </div>
            </button>
          ) : (
            <button 
              onClick={login}
              className="whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-neutral-200 hover:bg-neutral-200/50 hover:text-neutral-900 px-4 py-2 flex items-center gap-2 text-sm text-neutral-600 h-fit justify-start cursor-pointer w-full"
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                    <polyline points="10 17 15 12 10 7"></polyline>
                    <line x1="15" x2="3" y1="12" y2="12"></line>
                  </svg>
                  <p className="text-md font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>Wallet Manager</p>
                </div>
                <p className="text-xs text-neutral-600 hidden md:block" style={{ fontFamily: 'var(--font-dm-mono)' }}>Connect to manage jobs</p>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
