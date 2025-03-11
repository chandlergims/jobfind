'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  salary: string;
  contactInfo: string;
  logo: string;
  createdAt: string;
  createdBy: string;
}

export default function TokenizePage() {
  const { isAuthenticated, token, login } = useAuth();
  const [userJobs, setUserJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<string | null>(null); // Changed to single selection
  const [loading, setLoading] = useState(true);
  const [tokenizing, setTokenizing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [splTokenAddress, setSplTokenAddress] = useState('');
  const [addressError, setAddressError] = useState('');
  const [tokenizeError, setTokenizeError] = useState('');
  
  // Extract user ID from token
  const getUserIdFromToken = (token: string): string | null => {
    try {
      // Simple JWT parsing (in a real app, use a proper JWT library)
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
  
  // Fetch user's jobs
  useEffect(() => {
    const fetchUserJobs = async () => {
      if (!isAuthenticated || !token) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const allJobs = await response.json();
          // Get user ID from token
          const userId = getUserIdFromToken(token);
          
          if (userId) {
            // Filter jobs created by the current user
            const userCreatedJobs = allJobs.filter((job: Job) => job.createdBy === userId);
            setUserJobs(userCreatedJobs);
          } else {
            setUserJobs([]);
          }
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserJobs();
  }, [isAuthenticated, token]);
  
  // Select job (only one at a time)
  const selectJob = (jobId: string) => {
    setSelectedJob(prevSelected => prevSelected === jobId ? null : jobId);
  };
  
  // Handle tokenize button click
  const handleTokenize = async () => {
    if (!selectedJob) {
      setTokenizeError('Please select a job to tokenize');
      return;
    }
    
    if (!splTokenAddress) {
      setTokenizeError('Please enter an SPL token address');
      return;
    }
    
    // Validate SPL token address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(splTokenAddress)) {
      setAddressError('Invalid SPL token address format');
      return;
    }
    
    // Clear any previous errors and set initial states
    setTokenizeError('');
    setAddressError('');
    setTokenizing(true);
    setSuccess(false);
    
    try {
      // Add a small delay to ensure UI updates before API call
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const response = await fetch('/api/tokenized-jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ 
          jobId: selectedJob,
          splTokenAddress: splTokenAddress
        }),
      });
      
      // Add a small delay to ensure response is fully processed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const data = await response.json();
      
      if (response.ok) {
        // Set success state first before clearing other states
        setSuccess(true);
        // Clear any error messages on success
        setTokenizeError('');
        setTokenizing(false);
        
        // Show success message briefly before redirecting
        setTimeout(() => {
          // Redirect to jobs page after successful tokenization
          window.location.href = '/jobs';
        }, 2000); // Increased delay for production environment
      } else {
        console.error('Tokenization error:', data);
        // Ensure we set success to false first
        setSuccess(false);
        setTokenizing(false);
        
        // Add a small delay before showing error message
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // If the job is already tokenized, redirect to jobs page
        if (data.error === 'Job is already tokenized') {
          setTokenizeError('This job has already been tokenized');
          setTimeout(() => {
            window.location.href = '/jobs';
          }, 2000);
        } else {
          setTokenizeError(data.error || 'Failed to tokenize job');
        }
      }
    } catch (error) {
      console.error('Error tokenizing job:', error);
      // Ensure we set success to false first
      setSuccess(false);
      setTokenizing(false);
      
      // Add a small delay before showing error message
      await new Promise(resolve => setTimeout(resolve, 200));
      setTokenizeError('An error occurred while tokenizing the job. Please try again.');
    }
  };
  
  // Handle job deletion
  const handleDeleteJob = async (jobId: string) => {
    if (confirm('Are you sure you want to delete this job?')) {
      try {
        const response = await fetch(`/api/jobs/${jobId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          // Remove the job from the state
          setUserJobs(prevJobs => prevJobs.filter(job => job._id !== jobId));
          // Also clear selection if this job was selected
          if (selectedJob === jobId) {
            setSelectedJob(null);
          }
        } else {
          alert('Failed to delete job');
        }
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('An error occurred while deleting the job');
      }
    }
  };
  
  // Show a notification banner if not authenticated
  const NotAuthenticatedBanner = () => {
    if (!isAuthenticated) {
      return (
        <div className="bg-[#f9f7f1] rounded-lg p-4 mb-6 border border-[#d19900]">
          <div className="flex items-start gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-[#d19900] mt-0.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
              <line x1="12" y1="9" x2="12" y2="13"></line>
              <line x1="12" y1="17" x2="12.01" y2="17"></line>
            </svg>
            <div>
              <h3 className="font-bold text-sm text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Login Required</h3>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                You need to be logged in to tokenize job listings. Please connect your wallet to continue.
              </p>
              <button 
                onClick={login}
                className="mt-2 px-3 py-1 bg-[#d19900] text-white text-xs rounded-md hover:bg-[#b38600] transition-colors"
                style={{ fontFamily: 'var(--font-dm-mono)' }}
              >
                Connect Wallet
              </button>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };
  
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          Your Job Listings
        </h2>
        
        {loading ? (
          <div className="text-center py-8">
            <svg className="animate-spin h-8 w-8 text-[#d19900] mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-2 text-gray-500">Loading your jobs...</p>
          </div>
        ) : userJobs.length === 0 ? (
          <div className="text-center py-8">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <h3 className="text-lg font-bold mb-2 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>No Jobs Found</h3>
            <p className="text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              You haven't created any job listings yet.
            </p>
            <Link href="/jobs">
              <button 
                className="px-4 py-2 bg-[#d19900] text-white rounded-md hover:bg-[#b38600] transition-colors"
                style={{ fontFamily: 'var(--font-dm-mono)' }}
              >
                Create a Job
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {userJobs.map(job => (
              <div key={job._id} className="block" onClick={() => selectJob(job._id)}>
                <div className={`rounded-md border ${selectedJob === job._id ? 'border-[#d19900]' : 'border-neutral-200'} bg-white text-neutral-950 shadow flex flex-col gap-2 p-2 justify-between hover:border-[#d19900] transition-all duration-300 cursor-pointer h-full`}>
                  <div>
                    <div className="flex flex-row items-center">
                      <div className="flex flex-row items-center gap-2">
                        <div className={`w-5 h-5 rounded-full border ${
                          selectedJob === job._id
                            ? 'border-[#d19900] bg-[#d19900]'
                            : 'border-gray-300'
                        } flex items-center justify-center mr-1`}>
                          {selectedJob === job._id && (
                            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 6L9 17l-5-5"></path>
                            </svg>
                          )}
                        </div>
                        <img 
                          alt="Job logo" 
                          className="size-8 rounded-full" 
                          src={job.logo || "https://via.placeholder.com/40"} 
                          onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.src = "https://via.placeholder.com/40";
                          }}
                        />
                        <div className="flex flex-col">
                          <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>{job.title || 'Untitled Job'}</p>
                          <p className="text-xs text-black" style={{ fontFamily: 'var(--font-dm-mono)' }}>{job.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-black" style={{ fontFamily: 'var(--font-dm-mono)' }}>Salary: {job.salary || 'Not specified'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {selectedJob && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Tokenize Your Job Listing</h2>
                <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  Enter the SPL token address to tokenize your selected job listing.
                </p>
              </div>
            </div>
            
            <div className="bg-[#f9f7f1] rounded-lg p-6 shadow-sm">
              <h3 className="text-sm font-bold mb-3 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                SPL Token Address
              </h3>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-grow">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                        <path d="M2 17l10 5 10-5"></path>
                        <path d="M2 12l10 5 10-5"></path>
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={splTokenAddress}
                      onChange={(e) => {
                        setSplTokenAddress(e.target.value);
                        // Basic validation for Solana addresses (base58 encoded, 32-44 characters)
                        const isValid = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(e.target.value);
                        setAddressError(isValid ? '' : 'Invalid SPL token address format');
                      }}
                      placeholder="Enter SPL token address"
                      className={`w-full pl-10 px-4 py-3 bg-white border-2 ${
                        addressError 
                          ? 'border-red-500 focus:border-red-500' 
                          : splTokenAddress 
                            ? 'border-[#d19900] focus:border-[#d19900]' 
                            : 'border-[#d19900]/30 focus:border-[#d19900]'
                      } rounded-md focus:outline-none shadow-sm text-black`}
                      style={{ fontFamily: 'var(--font-dm-mono)' }}
                    />
                  </div>
                  {addressError && (
                    <p className="text-red-500 text-xs mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                      {addressError}
                    </p>
                  )}
                </div>
                <button 
                  onClick={handleTokenize}
                  disabled={!selectedJob || tokenizing || !splTokenAddress || !!addressError}
                  className={`px-3 py-2 text-sm rounded-md transition-colors ${
                    !selectedJob || !splTokenAddress || !!addressError
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : success
                        ? 'bg-green-500 text-white'
                        : 'bg-[#d19900] text-white hover:bg-[#b38600]'
                  }`}
                  style={{ fontFamily: 'var(--font-dm-mono)' }}
                >
                  {tokenizing ? (
                    <>
                      <svg className="animate-spin h-3 w-3 text-white inline mr-1" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Tokenizing...
                    </>
                  ) : success ? (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline mr-1">
                        <path d="M20 6L9 17l-5-5"></path>
                      </svg>
                      Tokenized!
                    </>
                  ) : (
                    'Tokenize Job'
                  )}
                </button>
              </div>
              {tokenizeError ? (
                <p className="text-red-500 text-xs mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  {tokenizeError}
                </p>
              ) : (
                <p className="text-xs text-gray-500 mt-2" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                  Enter the SPL token address associated with this job listing. This will be used to verify ownership and track the job on the blockchain.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
      
      {!selectedJob && (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto mb-4 text-gray-400">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <h3 className="text-lg font-bold mb-2 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Select a Job to Tokenize</h3>
          <p className="text-gray-600 mb-4" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Please select one of your job listings above to tokenize it.
          </p>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>
          How to Tokenize Your Job Listing
        </h2>
        
        <div className="prose prose-sm max-w-none">
          <p className="text-gray-700 mb-4" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Tokenizing your job listing creates a unique SPL token on the Solana blockchain, providing benefits such as:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="bg-[#d19900]/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="16"></line>
                  <line x1="8" y1="12" x2="16" y2="12"></line>
                </svg>
                <h3 className="font-bold text-sm text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Increased Visibility</h3>
              </div>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                Your job listing will be featured prominently on the platform, reaching more potential candidates.
              </p>
            </div>
            
            <div className="bg-[#d19900]/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                </svg>
                <h3 className="font-bold text-sm text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Higher Engagement</h3>
              </div>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                Tokenized listings receive up to 5x more views and applications than standard listings.
              </p>
            </div>
            
            <div className="bg-[#d19900]/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                  <path d="M2 17l10 5 10-5"></path>
                  <path d="M2 12l10 5 10-5"></path>
                </svg>
                <h3 className="font-bold text-sm text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Token Holder Benefits</h3>
              </div>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                Holders of our platform token can get special allocation for having trending job listings.
              </p>
            </div>
            
            <div className="bg-[#d19900]/5 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                <h3 className="font-bold text-sm text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Performance-Based Promotion</h3>
              </div>
              <p className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                Job listings are promoted based on performance metrics, increasing visibility for high-quality opportunities.
              </p>
            </div>
          </div>
          
          <h3 className="font-bold text-sm mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Step-by-Step Process:</h3>
          
          <ol className="list-decimal pl-5 mb-4 space-y-2">
            <li className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              <span className="font-bold">Create an SPL Token</span>: Use a Solana wallet like Phantom or Solflare to create an SPL token for your job listing. You can use tools like the Solana Program Library (SPL) Token UI or Solana Token Creator.
            </li>
            <li className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              <span className="font-bold">Copy the SPL Token Address</span>: After creating your token, copy the SPL token address from your wallet or the token creation interface.
            </li>
            <li className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              <span className="font-bold">Link to Your Job</span>: Select your job listing and paste the SPL token address in the form above.
            </li>
            <li className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              <span className="font-bold">Verification</span>: Our system will verify the SPL token address and link it to your job listing.
            </li>
            <li className="text-xs text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              <span className="font-bold">Promotion</span>: Once verified, your job listing will be promoted based on its performance metrics and engagement.
            </li>
          </ol>
          
          <p className="text-gray-700 text-sm" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Tokenized job listings receive enhanced visibility, helping you connect with the right talent faster. As your listing gains traction, it may be featured in trending sections, further increasing its visibility.
          </p>
        </div>
      </div>
    </div>
  );
}
