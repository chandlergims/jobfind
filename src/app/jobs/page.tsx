'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

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

function SearchParamsWrapper({ setIsModalOpen }: { setIsModalOpen: (open: boolean) => void }) {
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  
  // Check if createJob query parameter is present
  useEffect(() => {
    const createJob = searchParams.get('createJob');
    if (createJob === 'true' && isAuthenticated) {
      setIsModalOpen(true);
    }
  }, [searchParams, isAuthenticated, setIsModalOpen]);
  
  return null;
}

export default function JobsPage() {
  const { isAuthenticated, token } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [tokenizedJobs, setTokenizedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTokenized, setLoadingTokenized] = useState(true);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    category: 'Trench Coaching',
    salary: '',
    minSalary: '',
    maxSalary: '',
    contactInfo: '',
    logo: ''
  });
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [deleteConfirmJobId, setDeleteConfirmJobId] = useState<string | null>(null);
  
  // Add Suspense boundary for useSearchParams
  const SearchParamsHandler = () => (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsWrapper setIsModalOpen={setIsModalOpen} />
    </Suspense>
  );
  
  // Fetch jobs from the backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/jobs');
        if (response.ok) {
          const data = await response.json();
          setJobs(data);
        } else {
          console.error('Failed to fetch jobs');
        }
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchJobs();
  }, []);
  
  // Fetch tokenized jobs
  useEffect(() => {
    const fetchTokenizedJobs = async () => {
      try {
        setLoadingTokenized(true);
        console.log('Fetching tokenized jobs from client...');
        
        // Use a more explicit URL with the full path
        const response = await fetch('/api/tokenized-jobs', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Tokenized jobs data:', data);
          setTokenizedJobs(data);
        } else {
          const errorText = await response.text();
          console.error('Failed to fetch tokenized jobs:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching tokenized jobs:', error);
      } finally {
        setLoadingTokenized(false);
      }
    };
    
    fetchTokenizedJobs();
  }, []);
  
  // Get unique categories from jobs, ensuring all predefined categories are included
  const predefinedCategories = ['Trench Coaching', 'Sniper Guru', 'Fee Masterclass', 'Logo Maker', 'Telegram Bot Developer', 'Web Developer', 'Other'];
  const jobCategories = Array.from(new Set(jobs.map(job => job.category || 'Uncategorized')));
  const categories = ['All', ...predefinedCategories, ...jobCategories.filter(cat => !predefinedCategories.includes(cat))];
  
  // Filter jobs based on search query (only job title) and selected category
  const filteredJobs = jobs.filter(job => {
    // Filter by search query
    const matchesQuery = searchQuery.trim() === '' || 
      (job.title?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    // Filter by category
    const matchesCategory = !selectedCategory || selectedCategory === 'All' || 
      job.category === selectedCategory;
    
    return matchesQuery && matchesCategory;
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewJob(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    // Check file size (limit to 1MB)
    if (file.size > 1024 * 1024) {
      alert('File size should be less than 1MB');
      return;
    }
    
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setLogoPreview(base64String);
      setNewJob(prev => ({
        ...prev,
        logo: base64String
      }));
    };
    reader.readAsDataURL(file);
  };
  
  // State for form validation errors
  const [formErrors, setFormErrors] = useState({
    logo: '',
    salary: ''
  });
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Reset form errors
    setFormErrors({
      logo: '',
      salary: ''
    });
    
    if (!isAuthenticated || !token) {
      alert("You must be logged in to create a job");
      return;
    }
    
    // Validate form
    let hasErrors = false;
    
    // Check if logo is provided
    if (!newJob.logo) {
      setFormErrors(prev => ({ ...prev, logo: "Company logo is required" }));
      hasErrors = true;
    }
    
    // Check if salary is in the correct format
    if (!newJob.minSalary || !newJob.maxSalary) {
      setFormErrors(prev => ({ ...prev, salary: "Please enter both minimum and maximum salary" }));
      hasErrors = true;
    }
    
    if (hasErrors) {
      return;
    }
    
    // Format salary to match the required pattern: $MIN - $MAX
    const formattedSalary = `$${newJob.minSalary} - $${newJob.maxSalary}`;
    
    // Create a job object without minSalary and maxSalary fields
    const jobToSubmit = {
      title: newJob.title,
      description: newJob.description,
      category: newJob.category,
      salary: formattedSalary,
      contactInfo: newJob.contactInfo,
      logo: newJob.logo
    };
    
    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobToSubmit),
      });
      
      if (response.ok) {
        const createdJob = await response.json();
        
        // Add the new job to the jobs array
        setJobs(prevJobs => [createdJob, ...prevJobs]);
        
        // Reset the form
        setNewJob({
          title: '',
          description: '',
          category: 'Trench Coaching',
          salary: '',
          minSalary: '',
          maxSalary: '',
          contactInfo: '',
          logo: ''
        });
        setLogoPreview(null);
        
        // Close the modal
        setIsModalOpen(false);
      } else {
        const error = await response.json();
        alert(`Failed to create job: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('An error occurred while creating the job');
    }
  };
  
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full px-1">
      {/* Blurry overlay when modal is open */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-md bg-white/30 z-40" onClick={() => setIsModalOpen(false)}></div>
      )}
      <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Jobs</h1>
      
      {/* Stats Card */}
      <div className="rounded-md border border-neutral-200 bg-white text-neutral-950 shadow p-3 mb-4 mx-auto">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
          <div className="rounded-md border border-neutral-200 p-2 flex flex-col items-center justify-center">
            <span className="text-lg font-bold text-black">{jobs.length}</span>
            <span className="text-xs text-gray-700 text-center" style={{ fontFamily: 'var(--font-dm-mono)' }}>Total</span>
          </div>
          
          {/* All possible job categories */}
          {['Trench Coaching', 'Sniper Guru', 'Fee Masterclass', 'Logo Maker', 'Telegram Bot Developer', 'Web Developer', 'Other'].map(category => {
            const count = jobs.filter(job => job.category === category).length;
            return (
              <div key={category} className="rounded-md border border-neutral-200 p-2 flex flex-col items-center justify-center">
                <span className="text-lg font-bold text-black">{count}</span>
                <span className="text-xs text-gray-700 text-center truncate w-full text-[10px]" style={{ fontFamily: 'var(--font-dm-mono)' }}>{category}</span>
              </div>
            );
          })}
        </div>
      </div>
      
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Search</h2>
        <div className="relative w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-search absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-black z-10 pointer-events-none">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.3-4.3"></path>
          </svg>
          <input 
            className="flex h-9 rounded-md border-0 px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-neutral-950 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#d19900] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm dark:file:text-neutral-50 dark:placeholder:text-neutral-400 dark:focus-visible:ring-[#d19900] pl-9 w-full cursor-text bg-[#e9e9e9] text-black"
            placeholder="Search Jobs . . ."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      <div className="flex flex-col gap-2 mb-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Trending Jobs</h2>
          {isAuthenticated && (
            <Link href="/tokenize">
              <button 
                className="px-3 py-1 bg-[#d19900] text-white rounded-md hover:bg-[#b38600] transition-colors cursor-pointer"
                style={{ fontFamily: 'var(--font-dm-mono)' }}
              >
                Tokenize Job
              </button>
            </Link>
          )}
        </div>
        
        {/* Trending Jobs filters */}
        <div className="flex flex-wrap gap-2 mb-4">
          <button className="px-3 py-1 rounded-md text-sm transition-colors bg-white border border-gray-200 text-gray-700 hover:border-[#d19900] cursor-pointer" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Market Cap
          </button>
          <button className="px-3 py-1 rounded-md text-sm transition-colors bg-white border border-gray-200 text-gray-700 hover:border-[#d19900] cursor-pointer" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Volume
          </button>
          <button className="px-3 py-1 rounded-md text-sm transition-colors bg-white border border-gray-200 text-gray-700 hover:border-[#d19900] cursor-pointer" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Price
          </button>
          <button className="px-3 py-1 rounded-md text-sm transition-colors bg-white border border-gray-200 text-gray-700 hover:border-[#d19900] cursor-pointer" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            24h Change
          </button>
        </div>
        
        {/* Job Creation Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
            <div className="bg-white rounded-lg p-5 w-full max-w-sm max-h-[70vh] overflow-y-auto z-50 border-2 border-[#d19900] shadow-xl" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Create New Job</h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
              
                <div className="mb-4 flex flex-col items-center">
                <div className={`w-24 h-24 rounded-full bg-gray-200 mb-2 flex items-center justify-center overflow-hidden border-2 ${formErrors.logo ? 'border-red-500' : 'border-[#d19900]'}`}>
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Company logo" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`${formErrors.logo ? 'text-red-400' : 'text-gray-400'}`}>
                      <path d="M4 22h16a2 2 0 0 0 2-2V8l-6-6H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2z"></path>
                      <path d="M14 2v6h6"></path>
                      <path d="M12 18v-6"></path>
                      <path d="M9 15h6"></path>
                    </svg>
                  )}
                </div>
                <div className="flex flex-col items-center">
                  <label className="px-3 py-1 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 text-sm font-medium" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                    Upload Logo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      required
                    />
                  </label>
                  {formErrors.logo && (
                    <p className="text-red-500 text-xs mt-1" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                      {formErrors.logo}
                    </p>
                  )}
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Job Title</label>
                  <input
                    type="text"
                    name="title"
                    value={newJob.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Description</label>
                  <textarea
                    name="description"
                    value={newJob.description}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                    rows={4}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Job Category</label>
                  <select
                    name="category"
                    value={newJob.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                  >
                    <option value="Trench Coaching">Trench Coaching</option>
                    <option value="Sniper Guru">Sniper Guru</option>
                    <option value="Fee Masterclass">Fee Masterclass</option>
                    <option value="Logo Maker">Logo Maker</option>
                    <option value="Telegram Bot Developer">Telegram Bot Developer</option>
                    <option value="Web Developer">Web Developer</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Salary Range</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="minSalary"
                          value={newJob.minSalary}
                          onChange={handleInputChange}
                          placeholder="Min"
                          className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                    <span className="text-gray-500">-</span>
                    <div className="flex-1">
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                        <input
                          type="number"
                          name="maxSalary"
                          value={newJob.maxSalary}
                          onChange={handleInputChange}
                          placeholder="Max"
                          className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                          required
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'var(--font-dm-sans)' }}>Contact Information</label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={newJob.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Discord or Telegram"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#d19900] text-black"
                    required
                  />
                </div>
                
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="mr-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                    style={{ fontFamily: 'var(--font-dm-mono)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-[#d19900] rounded-md hover:bg-[#b38600]"
                    style={{ fontFamily: 'var(--font-dm-mono)' }}
                  >
                    Create Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        {/* Trending Jobs section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {loadingTokenized ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-dm-mono)' }}>Loading trending jobs...</p>
            </div>
          ) : tokenizedJobs.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-dm-mono)' }}>No trending jobs found.</p>
            </div>
          ) : (
            tokenizedJobs.map((tokenizedJob) => {
              const job = tokenizedJob.jobId;
              if (!job) return null;
              
              return (
                <div key={tokenizedJob._id} className="block">
                  <a 
                    href={`https://pump.fun/coin/${tokenizedJob.splTokenAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-md border border-[#d19900] bg-white text-neutral-950 shadow flex flex-col gap-2 p-2 justify-between hover:bg-[#d19900]/5 transition-all duration-300 cursor-pointer h-full block"
                    title="View on Pump.fun"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-2">
                        <div className="relative">
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
                          <div className="absolute -top-1 -right-1 bg-[#d19900] rounded-full size-3 border border-white"></div>
                        </div>
                        <div className="flex flex-col">
                          <p className="text-sm font-bold" style={{ fontFamily: 'var(--font-dm-mono)' }}>{job.title || 'Untitled Job'}</p>
                          <p className="text-xs text-black" style={{ fontFamily: 'var(--font-dm-mono)' }}>{job.category || 'Uncategorized'}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#d19900]">
                          <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                          <path d="M2 17l10 5 10-5"></path>
                          <path d="M2 12l10 5 10-5"></path>
                        </svg>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <div className="flex items-center">
                        <span className="text-xs text-[#d19900] font-medium" style={{ fontFamily: 'var(--font-dm-mono)' }}>Tokenized</span>
                      </div>
                    </div>
                  </a>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {/* Jobs Section */}
      <div className="flex flex-col gap-2 mt-8">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Jobs</h2>
          {isAuthenticated && (
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1 bg-[#d19900] text-white rounded-md hover:bg-[#b38600] transition-colors cursor-pointer"
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              Create Job
            </button>
          )}
        </div>
        
        {/* Category filter buttons */}
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === 'All' ? null : category)}
              className={`px-3 py-1 rounded-md text-sm transition-colors ${
                (category === 'All' && !selectedCategory) || selectedCategory === category
                  ? 'bg-[#d19900] text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:border-[#d19900]'
              }`}
              style={{ fontFamily: 'var(--font-dm-mono)' }}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {loading ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-dm-mono)' }}>Loading jobs...</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="col-span-3 text-center py-8">
              <p className="text-gray-500" style={{ fontFamily: 'var(--font-dm-mono)' }}>No jobs found. Be the first to create one!</p>
            </div>
          ) : (
            filteredJobs.map(job => (
              <div key={job._id} className="block">
                <div className="rounded-md border border-neutral-200 bg-white text-neutral-950 shadow flex flex-col gap-2 p-2 justify-between hover:border-[#d19900] transition-all duration-300 cursor-pointer h-full relative">
                  {/* Delete confirmation overlay */}
                  {deleteConfirmJobId === job._id && (
                    <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-md flex flex-col items-center justify-center z-10 p-2">
                      <p className="text-xs font-medium text-gray-800 mb-2 text-center" style={{ fontFamily: 'var(--font-dm-mono)' }}>
                        Are you sure you want to delete this job?
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteConfirmJobId(null);
                          }}
                          className="px-2 py-0.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 text-xs"
                          style={{ fontFamily: 'var(--font-dm-mono)' }}
                        >
                          Cancel
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            
                            // Delete the job
                            fetch(`/api/jobs/${job._id}`, {
                              method: 'DELETE',
                              headers: {
                                'Authorization': `Bearer ${token}`
                              }
                            })
                            .then(response => {
                              if (response.ok) {
                                // Remove the job from the state
                                setJobs(prevJobs => prevJobs.filter(j => j._id !== job._id));
                              } else {
                                alert('Failed to delete job');
                              }
                              setDeleteConfirmJobId(null);
                            })
                            .catch(error => {
                              console.error('Error deleting job:', error);
                              alert('An error occurred while deleting the job');
                              setDeleteConfirmJobId(null);
                            });
                          }}
                          className="px-2 py-0.5 bg-red-500 text-white rounded-md hover:bg-red-600 text-xs"
                          style={{ fontFamily: 'var(--font-dm-mono)' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                  <Link href={`/jobs/${job._id}`} onClick={(e) => deleteConfirmJobId === job._id && e.preventDefault()}>
                    <div className="flex flex-row items-center justify-between">
                      <div className="flex flex-row items-center gap-2">
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
                      {isAuthenticated && token && (() => {
                        // Extract user ID from token
                        try {
                          const base64Url = token.split('.')[1];
                          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
                          const jsonPayload = decodeURIComponent(
                            atob(base64)
                              .split('')
                              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                              .join('')
                          );
                          const userId = JSON.parse(jsonPayload).id;
                          return job.createdBy === userId;
                        } catch (error) {
                          console.error('Error parsing token:', error);
                          return false;
                        }
                      })() && (
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setDeleteConfirmJobId(job._id);
                          }}
                          className="size-6 shrink-0 hover:bg-red-100 rounded-md transition-all duration-300 flex items-center justify-center text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                          </svg>
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs text-black" style={{ fontFamily: 'var(--font-dm-mono)' }}>Salary: {job.salary || 'Not specified'}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
