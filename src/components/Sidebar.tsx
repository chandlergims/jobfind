'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, login, logout, isAuthenticated, loading } = useAuth();
  const pathname = usePathname();
  
  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);
  
  // Check if current path is home or specific paths
  const isHomeActive = pathname === '/';
  const isJobsActive = pathname === '/jobs' || pathname.startsWith('/jobs/');
  const isTokenizeActive = pathname === '/tokenize';
  const isProfileActive = pathname === '/profile';
  
  const truncatedAddress = user?.walletAddress 
    ? `${user.walletAddress.slice(0, 6)}...${user.walletAddress.slice(-4)}`
    : '';

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="text-gray-800 h-screen">
      {/* Mobile toggle button */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 left-4 z-20 sm:hidden bg-white p-2 rounded-md shadow-md border border-gray-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
          <line x1="4" x2="20" y1="12" y2="12"></line>
          <line x1="4" x2="20" y1="6" y2="6"></line>
          <line x1="4" x2="20" y1="18" y2="18"></line>
        </svg>
      </button>
      
      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-10 sm:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
      
      <div className={`fixed inset-y-0 z-20 h-svh w-full sm:w-64 md:flex left-0 transform transition-transform duration-300 ease-in-out sm:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-full w-full flex-col gap-2 bg-[#f9f9f9]">
          {/* Header */}
          <div data-sidebar="header" className="h-[56px] flex px-4">
            <div className="flex items-center justify-between w-full">
              <Link href="/" className="flex items-center h-full">
                <div className="flex items-center gap-2">
                  <img 
                    alt="Logo" 
                    width="100" 
                    height="100" 
                    className="w-6 h-6" 
                    src="/logo.png"
                  />
                  <h3 className="text-lg font-bold leading-none mt-0.5" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>TrenchLink</h3>
                </div>
              </Link>
            </div>
          </div>
          
          {/* Separator */}
          <div className="h-[1px] w-[90%] mx-auto bg-gray-200"></div>
          
          {/* Content */}
          <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-auto pl-2 relative">
            <ul className="flex w-full min-w-0 flex-col gap-2">
              {/* Menu Items */}
              <div className="group">
                <li className="group relative">
                  <Link href="/">
                    <button className={`peer gap-2 overflow-hidden rounded-md p-2 text-left outline-none ${isHomeActive ? 'text-[#d19900] font-semibold' : 'hover:bg-gray-100'} h-8 text-sm flex items-center font-medium transition-all group justify-between w-full`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                            <polyline points="9 22 9 12 15 12 15 22"></polyline>
                          </svg>
                          <h1 className="text-sm font-semibold" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>Home</h1>
                        </div>
                      </div>
                    </button>
                  </Link>
                </li>
              </div>
              
              <div className="group">
                <li className="group relative">
                  <Link href="/jobs">
                    <button className={`peer gap-2 overflow-hidden rounded-md p-2 text-left outline-none ${isJobsActive ? 'text-[#d19900] font-semibold' : 'hover:bg-gray-100'} h-8 text-sm flex items-center font-medium transition-all group justify-between w-full`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                          </svg>
                          <h1 className="text-sm font-semibold" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>Jobs</h1>
                        </div>
                        {/* Removed dropdown arrow */}
                      </div>
                    </button>
                  </Link>
                </li>
              </div>
              
              <div className="group">
                <li className="group relative">
                  <Link href="/tokenize">
                    <button className={`peer gap-2 overflow-hidden rounded-md p-2 text-left outline-none ${pathname === '/tokenize' ? 'text-[#d19900] font-semibold' : 'hover:bg-gray-100'} h-8 text-sm flex items-center font-medium transition-all group justify-between w-full`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M12 6v12"></path>
                            <path d="M6 12h12"></path>
                          </svg>
                          <h1 className="text-sm font-semibold" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>Tokenize</h1>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center border py-0.5 font-semibold border-[#d19900] bg-[#d19900]/10 text-[#d19900] text-[10px] h-5 w-fit px-1 rounded-md">New</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                </li>
              </div>
              
              <div className="group">
                <li className="group relative">
                  <Link href="/documentation">
                    <button className={`peer gap-2 overflow-hidden rounded-md p-2 text-left outline-none ${pathname === '/documentation' ? 'text-[#d19900] font-semibold' : 'hover:bg-gray-100'} h-8 text-sm flex items-center font-medium transition-all group justify-between w-full`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                          </svg>
                          <h1 className="text-sm font-semibold" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>Documentation</h1>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="inline-flex items-center border py-0.5 font-semibold border-[#d19900] bg-[#d19900]/10 text-[#d19900] text-[10px] h-5 w-fit px-1 rounded-md">New</div>
                        </div>
                      </div>
                    </button>
                  </Link>
                </li>
              </div>
              
              <div className="group">
                <li className="group relative">
                  <Link href="/profile">
                    <button className={`peer gap-2 overflow-hidden rounded-md p-2 text-left outline-none ${isProfileActive ? 'text-[#d19900] font-semibold' : 'hover:bg-gray-100'} h-8 text-sm flex items-center font-medium transition-all group justify-between w-full`}>
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                          </svg>
                          <h1 className="text-sm font-semibold" style={{ fontFamily: '"DM Sans", "DM Sans Fallback"' }}>Profile</h1>
                        </div>
                      </div>
                    </button>
                  </Link>
                </li>
              </div>
            </ul>
          </div>
          
          {/* Separator */}
          <div className="h-[1px] w-[90%] mx-auto bg-gray-200"></div>
          
          {/* Footer */}
          <div className="flex flex-col gap-2 p-2">
            <ul className="flex w-full min-w-0 flex-col gap-2">
              <li className="group relative">
                <div className="relative flex justify-end">
                  {isAuthenticated ? (
                    <>
                      <button 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="flex items-center overflow-hidden rounded-md p-2 text-left outline-none transition-all duration-300 ease-in-out hover:text-sidebar-active focus-visible:ring-2 active:text-sidebar-foreground-accent disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 data-[active=true]:font-medium data-[active=true]:text-sidebar-active data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-active group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 border border-[#f0b90b] text-[#f0b90b] hover:bg-[#f0b90b]/10 h-8 text-sm w-full justify-between gap-0"
                        style={{ fontFamily: 'var(--font-dm-mono)' }}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                            <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                            <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                          </svg>
                          <span className="ml-2">
                            {truncatedAddress}
                          </span>
                        </div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                          <path d="m7 15 5 5 5-5"></path>
                          <path d="m7 9 5-5 5 5"></path>
                        </svg>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isDropdownOpen && (
                        <div className="absolute top-0 right-0 translate-x-[calc(100%+8px)] -translate-y-1/2 min-w-48 rounded-lg overflow-hidden border border-gray-200 bg-white p-1 text-gray-800 shadow-md z-50" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                          {/* Wallet Address Header */}
                          <div className="p-2">
                            <div className="flex items-center gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-[#f0b90b]">
                                <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                                <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                              </svg>
                              <span className="text-sm">{truncatedAddress}</span>
                            </div>
                          </div>
                          
                          {/* Separator */}
                          <div className="-mx-1 my-1 h-px bg-gray-200"></div>
                          
                          {/* Logout Option */}
                          <div className="p-2">
                            <button
                              onClick={logout}
                              className="flex items-center gap-2 text-sm w-full text-left"
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
                      onClick={login}
                      className="flex items-center overflow-hidden rounded-md p-2 text-left outline-none transition-all duration-300 ease-in-out hover:text-sidebar-active focus-visible:ring-2 active:text-sidebar-foreground-accent disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 data-[active=true]:font-medium data-[active=true]:text-sidebar-active data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-active group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 border border-[#f0b90b] text-[#f0b90b] hover:bg-[#f0b90b]/10 h-8 text-sm w-full justify-center gap-0"
                      style={{ fontFamily: 'var(--font-dm-mono)' }}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                        <polyline points="10 17 15 12 10 7"></polyline>
                        <line x1="15" x2="3" y1="12" y2="12"></line>
                      </svg>
                      <span className="ml-2">
                        Connect Wallet
                      </span>
                    </button>
                  )}
                </div>
              </li>
              
              <li className="group relative">
                <a 
                  target="_blank" 
                  className="peer flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none transition-all hover:bg-gray-100 h-8 text-sm" 
                  href="https://twitter.com/trenchedin"
                >
                  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z"></path>
                  </svg>
                  <span className="truncate" style={{ fontFamily: 'var(--font-dm-mono)' }}>Follow Us</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
