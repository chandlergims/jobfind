'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';

export default function ProfilePage() {
  const { user, logout, isAuthenticated, token } = useAuth();
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [jobCount, setJobCount] = useState(0);
  
  // Use the wallet address from the user object
  const walletAddress = user?.walletAddress || '';
  
  // Format wallet address for display
  const formatWalletAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-5)}`;
  };
  
  // Format the join date from user.createdAt
  const formatJoinDate = (dateString?: string) => {
    if (!dateString) return 'Unknown';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  const joinDate = formatJoinDate(user?.createdAt);
  
  // Handle logout
  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };
  
  // Extract user ID from token
  const getUserIdFromToken = (token: string): string | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload).id;
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };
  
  // Fetch job count
  useEffect(() => {
    const fetchUserJobs = async () => {
      // Only fetch jobs if we have a token
      if (!isAuthenticated || !token) return;
      
      try {
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const allJobs = await response.json();
          
          const userId = getUserIdFromToken(token);
          
          if (userId) {
            // Count jobs created by the current user
            const userCreatedJobs = allJobs.filter((job: any) => job.createdBy === userId);
            setJobCount(userCreatedJobs.length);
          }
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };
    
    fetchUserJobs();
  }, [isAuthenticated, token]);
  
  // If not authenticated, show login message
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
        <div className="text-center">
          <h2 className="text-lg font-semibold">You are not logged in</h2>
          <p className="text-sm text-neutral-500">Please login to continue</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-black">Account</h1>
        <button 
          onClick={handleLogout}
          className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-neutral-950 disabled:pointer-events-none disabled:opacity-50 hover:bg-neutral-100 hover:text-neutral-900 h-9 px-4 py-2 text-black"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-black">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" x2="9" y1="12" y2="12"></line>
          </svg>
          Log out
        </button>
      </div>
      
      <div className="rounded-md border border-neutral-200 bg-white text-neutral-950 shadow flex flex-col gap-4 p-4">
        <div className="flex items-center">
          <div className="flex flex-row gap-2 items-center">
            <span className="relative flex shrink-0 overflow-hidden rounded-full w-12 h-12 bg-neutral-100">
              {profilePicture ? (
                <img 
                  src={profilePicture} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center rounded-full">
                  {walletAddress ? walletAddress.slice(0, 2) : 'AE'}
                </span>
              )}
            </span>
            <div className="flex flex-col">
              <p className="cursor-pointer hover:bg-neutral-200 rounded-md w-fit px-1 text-md font-bold">
                {walletAddress ? formatWalletAddress(walletAddress) : 'AEnb3z...Hpz5wT'}
              </p>
              <p className="text-xs text-neutral-500">Joined on {joinDate}</p>
            </div>
          </div>
        </div>
        
        <div className="h-[1px] w-full bg-neutral-200"></div>
        
        <div className="flex flex-col">
          <p className="text-xs font-bold text-neutral-600">User ID</p>
          <p className="text-sm">{user?.id || 'cm7yb398h00x28gpn4r8rzhq0'}</p>
        </div>
        
        <div className="h-[1px] w-full bg-neutral-200"></div>
        
        <div className="flex flex-col">
          <p className="text-xs font-bold text-neutral-600">Connected Wallet</p>
          <p className="text-sm">{walletAddress || 'AEnb3z3o8NoVH5r7ppVWXw2DCu84S8n1L5MsP1Hpz5wT'}</p>
        </div>
        
        <div className="h-[1px] w-full bg-neutral-200"></div>
        
        <div className="flex flex-col">
          <p className="text-xs font-bold text-neutral-600">Job Listings Created</p>
          <p className="text-sm">{jobCount}</p>
        </div>
      </div>
    </div>
  );
}
