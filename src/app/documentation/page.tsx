'use client';

import { useState } from 'react';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: 'Overview' },
    { id: 'for-job-seekers', title: 'For Job Seekers' },
    { id: 'for-job-posters', title: 'For Job Posters' },
    { id: 'tokenization', title: 'Job Tokenization' },
    { id: 'rewards', title: 'Rewards System' },
  ];

  return (
    <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full h-full max-h-full overflow-y-auto px-1 py-8">
      <h1 className="text-3xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Documentation</h1>
      
      <div className="flex flex-col md:flex-row gap-8">
        {/* Main Content */}
        <div className="flex-1 rounded-md border border-neutral-200 bg-white p-6 shadow order-2 md:order-1">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Platform Overview</h2>
                <div className="prose max-w-none text-black">
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  TrenchLink is a centralized hub connecting knowledge seekers with valuable opportunities, empowering professionals to showcase their expertise, and enabling businesses to find exceptional talent for their projects and tasks. When crypto markets experience downturns, finding stable income opportunities becomes crucial for many in the space.
                </p>
                
                <div className="bg-[#d19900]/10 border border-[#d19900] rounded-md p-4 mb-6">
                  <h3 className="text-[#d19900] font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Market Context</h3>
                  <p className="text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    In times of market volatility and downturns, TrenchLink provides a stable platform for connecting talent with opportunities, ensuring that builders and contributors can continue to earn and grow even when token prices are struggling.
                  </p>
                </div>
                
                <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Our Mission</h3>
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  We're building a resilient ecosystem where:
                </p>
                <ul className="list-disc pl-6 mb-4 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Job seekers</strong> can find reliable income sources through full-time positions, freelance gigs, or competitive tasks</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Project owners and companies</strong> can access a pool of talented professionals specifically experienced in blockchain and crypto</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>The community</strong> benefits from innovative tokenization features that create new economic opportunities</li>
                </ul>
                
                <h3 className="text-xl font-bold text-black mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Key Features</h3>
                <ul className="list-disc pl-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Job Listings:</strong> Browse and apply to crypto-focused job opportunities</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Job Tokenization:</strong> Convert job listings into tradable tokens with real utility</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Rewards System:</strong> Earn benefits for creating popular job tokens and participating in the ecosystem</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Secure Wallet Integration:</strong> Connect your crypto wallet for seamless interaction</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeSection === 'for-job-seekers' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>For Job Seekers</h2>
              <div className="prose max-w-none text-black">
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  TrenchLink provides multiple ways for crypto professionals to find income opportunities, especially during challenging market conditions.
                </p>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Finding Opportunities</h3>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Browse Job Listings:</strong> Explore available positions filtered by category, salary range, and more</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Trending Jobs:</strong> Discover the most popular tokenized jobs that may offer additional benefits</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Direct Applications:</strong> Apply directly through contact information provided by employers</li>
                </ul>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Types of Opportunities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Full-time Positions</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Permanent roles with crypto projects, DAOs, and blockchain companies</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Freelance Gigs</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Short-term contracts for specific deliverables or time periods</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Competitive Tasks</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Complete specific challenges or bounties to earn rewards</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Token-incentivized Work</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Opportunities that include tokenized compensation or benefits</p>
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Tips for Success</h3>
                <ul className="list-disc pl-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Complete your profile with relevant skills and experience</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Connect your wallet to access all platform features</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Check trending jobs regularly for high-potential opportunities</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Respond promptly to job listings as competition can be high</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeSection === 'for-job-posters' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>For Job Posters</h2>
              <div className="prose max-w-none text-black">
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  TrenchLink offers a unique platform for companies, projects, and individuals to find qualified talent in the crypto space, with innovative features that go beyond traditional job boards.
                </p>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Creating Job Listings</h3>
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Posting a job on TrenchLink is simple:
                </p>
                <ol className="list-decimal pl-6 mb-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Connect your wallet to authenticate</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Click "Create Job" in the Jobs section</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Fill out the job details including:
                    <ul className="list-disc pl-6 mt-2 space-y-1">
                      <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Job title and description</li>
                      <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Category (Software Engineer, Website Developer, etc.)</li>
                      <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Salary range</li>
                      <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Contact information</li>
                      <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Company logo</li>
                    </ul>
                  </li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Submit your listing</li>
                </ol>
                
                <div className="bg-[#d19900]/10 border border-[#d19900] rounded-md p-4 mb-6">
                  <h3 className="text-[#d19900] font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Benefits of Posting Jobs</h3>
                  <ul className="list-disc pl-6 space-y-2 text-black">
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Targeted Audience:</strong> Reach crypto-native professionals specifically looking for opportunities in the space</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Tokenization Potential:</strong> Convert your job listing into a tradable token for additional visibility and benefits</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Community Exposure:</strong> Gain visibility within an active community of blockchain talent</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Reward Opportunities:</strong> Earn platform rewards when your job tokens gain popularity</li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Best Practices</h3>
                <ul className="list-disc pl-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Provide clear, detailed job descriptions to attract qualified candidates</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Include competitive salary ranges appropriate for the current market</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Respond promptly to applicant inquiries</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Consider tokenizing high-visibility positions for maximum exposure</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Use a professional, recognizable logo to build trust with applicants</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeSection === 'tokenization' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Job Tokenization</h2>
              <div className="prose max-w-none text-black">
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  One of TrenchLink's most innovative features is the ability to tokenize job listings, creating a new economic layer on top of the traditional job marketplace.
                </p>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>What is Job Tokenization?</h3>
                <p className="text-black mb-6" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Job tokenization is the process of creating a tradable token that represents a specific job listing on our platform. These tokens exist on the Solana blockchain and can be bought, sold, and traded like any other cryptocurrency.
                </p>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>How to Tokenize a Job</h3>
                <ol className="list-decimal pl-6 mb-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Create a job listing (or select an existing one you've posted)</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Navigate to the "Tokenize" section in the sidebar</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Select the job you wish to tokenize</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Provide an SPL token address for your token</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Confirm the tokenization</li>
                </ol>
                
                <div className="bg-[#d19900]/10 border border-[#d19900] rounded-md p-4 mb-6">
                  <h3 className="text-[#d19900] font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Benefits of Tokenization</h3>
                  <ul className="list-disc pl-6 space-y-2 text-black">
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Enhanced Visibility:</strong> Tokenized jobs appear in the "Trending Jobs" section</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Market Dynamics:</strong> Popular jobs can gain value through market demand</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Community Engagement:</strong> Creates additional incentives for community participation</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Reward Potential:</strong> Job posters can earn rewards based on token performance</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Economic Opportunities:</strong> Opens new avenues for value creation during market downturns</li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Viewing Tokenized Jobs</h3>
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Tokenized jobs are prominently displayed in the "Trending Jobs" section of the platform. Users can:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>View job details by clicking on the listing</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>See the associated token by clicking on the token icon</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Track performance metrics like market cap, volume, and price</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Visit pump.fun to trade or invest in job tokens</li>
                </ul>
              </div>
            </div>
          )}
          
          {activeSection === 'rewards' && (
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>Rewards System</h2>
              <div className="prose max-w-none text-black">
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  TrenchLink features a rewards system designed to incentivize participation and quality contributions to the platform ecosystem, creating additional earning opportunities during challenging market conditions.
                </p>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Rewards for Job Posters</h3>
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  When you post and tokenize jobs, you can earn rewards based on:
                </p>
                <ul className="list-disc pl-6 mb-6 space-y-2 text-black">
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Token Performance:</strong> Rewards for creating tokens that gain popularity and trading volume</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Quality Listings:</strong> Bonuses for well-detailed job postings that attract qualified candidates</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Platform Activity:</strong> Benefits for regular participation and multiple job listings</li>
                  <li style={{ fontFamily: 'var(--font-dm-sans)' }}><strong>Successful Placements:</strong> Additional rewards when positions are filled through the platform</li>
                </ul>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Trending Metrics</h3>
                <p className="text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Job tokens are ranked based on several key metrics:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Market Cap</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Total value of all tokens for a specific job listing</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Volume</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Trading activity over a specific time period</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Price</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Current value of an individual token</p>
                  </div>
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>24h Change</h4>
                    <p className="text-black text-sm" style={{ fontFamily: 'var(--font-dm-sans)' }}>Price movement over the last 24 hours</p>
                  </div>
                </div>
                
                <div className="bg-[#d19900]/10 border border-[#d19900] rounded-md p-4 mb-6">
                  <h3 className="text-[#d19900] font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Future Reward Features</h3>
                  <p className="text-black mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                    We're continuously expanding our rewards system with upcoming features including:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 text-black">
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Staking mechanisms for job tokens</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Governance rights for active platform participants</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Referral bonuses for bringing new users to the platform</li>
                    <li style={{ fontFamily: 'var(--font-dm-sans)' }}>Special rewards during extreme market conditions</li>
                  </ul>
                </div>
                
                <h3 className="text-xl font-bold mb-2" style={{ fontFamily: 'var(--font-dm-sans)' }}>Economic Resilience</h3>
                <p className="text-black" style={{ fontFamily: 'var(--font-dm-sans)' }}>
                  Our rewards system is specifically designed to create economic opportunities during crypto market downturns, providing alternative income streams and value creation mechanisms when traditional crypto investments may be struggling. By participating in the TrenchLink ecosystem, both job seekers and job posters can maintain activity and potential income even in challenging market conditions.
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 order-1 md:order-2">
          <div className="sticky top-4 rounded-md border border-neutral-200 bg-white p-4 shadow">
            <h2 className="text-lg font-bold text-black mb-4" style={{ fontFamily: 'var(--font-dm-sans)' }}>Contents</h2>
            <ul className="space-y-2">
              {sections.map((section) => (
                <li key={section.id}>
                  <button
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full text-left px-2 py-1 rounded-md transition-colors ${
                      activeSection === section.id
                        ? 'bg-[#d19900] text-white'
                        : 'text-black hover:bg-gray-100'
                    }`}
                    style={{ fontFamily: 'var(--font-dm-mono)' }}
                  >
                    {section.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
