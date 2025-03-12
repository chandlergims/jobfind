'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Modal from '@/components/Modal';

interface User {
  id: string;
  walletAddress: string;
  name?: string;
  email?: string;
  profilePicture?: string;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (isOpen: boolean) => void;
  connectPhantomWallet: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Add window.phantom type
declare global {
  interface Window {
    phantom?: {
      solana?: {
        isPhantom?: boolean;
        connect: () => Promise<{ publicKey: { toString: () => string } }>;
      };
    };
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Check if user is already logged in on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('auth_token');
    if (storedToken) {
      fetchCurrentUser(storedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch current user with token
  const fetchCurrentUser = async (authToken: string) => {
    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setToken(authToken);
      } else {
        // If token is invalid, clear it
        localStorage.removeItem('auth_token');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    } finally {
      setLoading(false);
    }
  };

  // Authenticate with our backend using the wallet address
  const authenticateWithWallet = async (walletAddress: string) => {
    try {
      setLoading(true);
      
      console.log(`Authenticating with wallet address: ${walletAddress}`);
      
      // Create the request payload
      const payload = { walletAddress };
      console.log('Auth request payload:', payload);
      
      // Call our API to authenticate with the wallet address
      console.log('Sending authentication request to /api/auth/wallet');
      const response = await fetch('/api/auth/wallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      console.log('Auth response status:', response.status);
      
      // Check response content type
      const contentType = response.headers.get('content-type');
      console.log("Response content type:", contentType);

      // Handle non-OK responses
      if (!response.ok) {
        let errorMessage = response.statusText || `Error ${response.status}`;
        
        try {
          // Only try to parse as JSON if the content type is JSON
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            console.error("Authentication error data:", errorData);
            errorMessage = errorData.error || errorMessage;
          } else {
            // If not JSON, get the text response
            const errorText = await response.text();
            console.error("Authentication error text:", errorText);
            errorMessage = `Server returned: ${errorText.substring(0, 100)}${errorText.length > 100 ? '...' : ''}`;
          }
        } catch (parseError: any) {
          console.error("Error parsing error response:", parseError);
          errorMessage = `Failed to parse error response: ${parseError.message || 'Unknown error'}`;
        }
        
        console.error(`Authentication failed: ${errorMessage}`);
        alert(`Authentication failed: ${errorMessage}`);
        return;
      }

      // Parse the successful response as JSON
      let data;
      try {
        const responseText = await response.text();
        console.log("Raw response text:", responseText);
        
        // Only try to parse if there's actual content
        if (responseText.trim()) {
          data = JSON.parse(responseText);
          console.log("Auth data received:", { 
            user: data.user ? { 
              id: data.user.id,
              walletAddress: data.user.walletAddress,
              // Include other user properties but not the token
            } : null,
            hasToken: !!data.token
          });
        } else {
          console.error("Empty response received");
          alert("Server returned an empty response");
          return;
        }
      } catch (parseError: any) {
        console.error("Error parsing auth response:", parseError);
        alert(`Failed to parse authentication response: ${parseError.message || 'Unknown error'}`);
        return;
      }
      
      // Validate the response data
      if (!data || !data.token || !data.user) {
        console.error("Invalid authentication response:", data);
        alert("Invalid authentication response from server");
        return;
      }
      
      // Save token to localStorage for persistence
      localStorage.setItem('auth_token', data.token);
      console.log("Token stored in localStorage");
      
      // Update state
      setUser(data.user);
      setToken(data.token);
      
      console.log("Authentication successful");
    } catch (error: any) {
      console.error('Wallet authentication error:', error);
      alert(`Wallet authentication error: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // Connect to Phantom wallet
  const connectPhantomWallet = async () => {
    try {
      console.log("Starting wallet connection process...");
      
      // Check if Phantom is installed
      const isPhantomInstalled = window.phantom?.solana?.isPhantom;
      console.log("Phantom installed:", isPhantomInstalled);
      
      if (!isPhantomInstalled) {
        alert("Phantom wallet is not installed. Please install it from https://phantom.app/");
        return;
      }
      
      // Connect to Phantom wallet
      console.log("Attempting to connect to Phantom wallet...");
      const response = await window.phantom?.solana?.connect();
      
      if (!response) {
        throw new Error("Failed to connect to Phantom wallet");
      }
      
      console.log("Connected to Phantom wallet:", response);
      const address = response.publicKey.toString();
      console.log("Wallet address:", address);
      
      // Authenticate with our backend
      await authenticateWithWallet(address);
      
      // Close the login modal
      setIsLoginModalOpen(false);
      
      console.log(`Successfully logged in with wallet: ${address}`);
    } catch (error: any) {
      console.error("Error connecting to Phantom wallet:", error);
      alert(`Failed to connect to Phantom wallet: ${error.message || 'Unknown error'}`);
    }
  };

  // Login function - opens the modal
  const login = () => {
    setIsLoginModalOpen(true);
  };

  // Logout function
  const logout = () => {
    // Clear our authentication
    localStorage.removeItem('auth_token');
    setUser(null);
    setToken(null);
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
    isLoginModalOpen,
    setIsLoginModalOpen,
    connectPhantomWallet,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      
      {/* Login Modal */}
      <Modal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} title="Connect Wallet">
        <div className="w-full">
          <p className="text-center text-gray-700 text-sm mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
            Connect your wallet to access TrenchLink
          </p>
          
          {/* Phantom Wallet Button */}
          <button
            onClick={connectPhantomWallet}
            className="w-full flex items-center justify-between p-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-lg transition-colors"
            style={{ fontFamily: 'var(--font-dm-mono)' }}
          >
            <div className="flex items-center">
              <div className="w-8 h-8 mr-3 rounded-full overflow-hidden flex items-center justify-center bg-[#ab9ff2]">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-white">
                  <path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"></path>
                  <path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"></path>
                </svg>
              </div>
              <span className="text-gray-800 text-sm">Phantom Wallet</span>
            </div>
            <span className="bg-[#f0b90b] text-xs text-white px-2 py-1 rounded">Connect</span>
          </button>
          
          <div className="text-center text-xs text-gray-500 mt-6">
            <p>Don't have Phantom wallet?</p>
            <a 
              href="https://phantom.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#f0b90b] hover:text-[#d19900]"
            >
              Download Phantom
            </a>
          </div>
        </div>
      </Modal>
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
