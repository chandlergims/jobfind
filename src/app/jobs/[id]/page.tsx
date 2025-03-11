'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface Job {
  _id: string;
  title: string;
  description: string;
  category: string;
  salary: string;
  contactInfo: string;
  logo: string;
  createdAt: string;
}

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.id as string;
  
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchJob = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/jobs/${jobId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch job');
        }
        
        const data = await response.json();
        setJob(data);
      } catch (error) {
        console.error('Error fetching job:', error);
        setError('Failed to load job details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchJob();
  }, [jobId]);
  
  if (loading) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
        <p className="text-center text-gray-500">Loading job details...</p>
      </div>
    );
  }
  
  if (error || !job) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error || 'Job not found'}</p>
          <Link href="/jobs" className="text-[#d19900] hover:underline" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  // For demo purposes, if the job doesn't exist in the database yet
  const demoJobs = {
    '1': {
      _id: '1',
      title: 'Senior Software Engineer',
      description: 'We are looking for a Senior Software Engineer to join our team. You will be responsible for developing and maintaining our web applications.',
      category: 'Software Engineer',
      salary: '$150,000 - $200,000',
      contactInfo: 'jobs@google.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Google_%22G%22_Logo.svg/1200px-Google_%22G%22_Logo.svg.png',
      createdAt: new Date().toISOString()
    },
    '2': {
      _id: '2',
      title: 'Frontend Developer',
      description: 'We are seeking a talented Frontend Developer to create amazing user experiences. You will be working with our design team to implement responsive web designs.',
      category: 'Website Developer',
      salary: '$120,000 - $160,000',
      contactInfo: 'careers@microsoft.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/Microsoft_logo.svg/1200px-Microsoft_logo.svg.png',
      createdAt: new Date().toISOString()
    },
    '3': {
      _id: '3',
      title: 'Backend Engineer',
      description: 'Join our team as a Backend Engineer to build scalable and efficient server-side applications. You will be working with our infrastructure team to design and implement APIs.',
      category: 'Software Engineer',
      salary: '$140,000 - $180,000',
      contactInfo: 'hiring@amazon.com',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4a/Amazon_icon.svg/2500px-Amazon_icon.svg.png',
      createdAt: new Date().toISOString()
    }
  };
  
  // If job is not found in the database, use demo job if available
  const displayJob = job._id ? job : (demoJobs[jobId as keyof typeof demoJobs] || null);
  
  if (!displayJob) {
    return (
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
        <div className="text-center">
          <p className="text-red-500 mb-4">Job not found</p>
          <Link href="/jobs" className="text-[#d19900] hover:underline" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            Back to Jobs
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/jobs" className="text-[#d19900] hover:underline" style={{ fontFamily: 'var(--font-dm-mono)' }}>
          ← Back to Jobs
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center gap-4 mb-6">
          <img 
            src={displayJob.logo || "https://via.placeholder.com/80"} 
            alt="Job logo" 
            className="w-20 h-20 rounded-full object-cover border border-gray-200"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = "https://via.placeholder.com/80";
            }}
          />
          <div>
            <h1 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>{displayJob.title || 'Untitled Job'}</h1>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <rect width="20" height="14" x="2" y="7" rx="2" ry="2"></rect>
              <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
            </svg>
            <span className="text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>{displayJob.category || 'Uncategorized'}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M12 6v6l4 2"></path>
            </svg>
            <span className="text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
              Posted {new Date(displayJob.createdAt).toLocaleDateString()}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
            </svg>
            <span className="text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>{displayJob.salary || 'Not specified'}</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {displayJob.description || 'No description provided'}
          </p>
        </div>
        
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Contact Information</h2>
          <p className="text-gray-700" style={{ fontFamily: 'var(--font-dm-mono)' }}>
            {displayJob.contactInfo}
          </p>
        </div>
        
        {/* Apply Now button removed as requested */}
      </div>
    </div>
  );
}
