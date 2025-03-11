import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TokenizedJob from '@/models/TokenizedJob';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Connecting to database...');
    await dbConnect();
    console.log('Database connected successfully');
    
    // Get all tokenized jobs and populate with job details
    console.log('Fetching tokenized jobs...');
    
    // Get the 3 most recent tokenized jobs
    const tokenizedJobs = await TokenizedJob.find({}).sort({ createdAt: -1 }).limit(3);
    console.log(`Found ${tokenizedJobs.length} tokenized jobs`);
    
    // Manually fetch job details for each tokenized job
    const populatedJobs = [];
    for (const tokenizedJob of tokenizedJobs) {
      try {
        const job = await Job.findById(tokenizedJob.jobId);
        if (job) {
          populatedJobs.push({
            _id: tokenizedJob._id,
            splTokenAddress: tokenizedJob.splTokenAddress,
            createdBy: tokenizedJob.createdBy,
            createdAt: tokenizedJob.createdAt,
            jobId: job
          });
        }
      } catch (err) {
        console.error(`Error fetching job for tokenized job ${tokenizedJob._id}:`, err);
      }
    }
    
    console.log(`Successfully populated ${populatedJobs.length} tokenized jobs`);
    return NextResponse.json(populatedJobs);
  } catch (error) {
    console.error('Error fetching tokenized jobs:', error);
    return NextResponse.json({ error: 'Failed to fetch tokenized jobs' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    await dbConnect();
    
    const body = await request.json();
    const { jobId, splTokenAddress } = body;
    
    // Validate required fields
    if (!jobId || !splTokenAddress) {
      return NextResponse.json({ error: 'Job ID and SPL token address are required' }, { status: 400 });
    }
    
    // Validate SPL token address format
    if (!/^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(splTokenAddress)) {
      return NextResponse.json({ error: 'Invalid SPL token address format' }, { status: 400 });
    }
    
    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }
    
    // Check if job is already tokenized
    const existingTokenizedJob = await TokenizedJob.findOne({ jobId });
    if (existingTokenizedJob) {
      return NextResponse.json({ error: 'Job is already tokenized' }, { status: 400 });
    }
    
    // Create new tokenized job
    const tokenizedJob = new TokenizedJob({
      jobId,
      splTokenAddress,
      createdBy: payload.id
    });
    
    const savedTokenizedJob = await tokenizedJob.save();
    console.log('Tokenized job saved successfully:', savedTokenizedJob._id);
    
    try {
      // Attempt to populate job details, but don't fail if it doesn't work
      await savedTokenizedJob.populate('jobId');
      console.log('Job details populated successfully');
    } catch (populateError) {
      // Log the error but continue
      console.error('Error populating job details:', populateError);
      // This is non-critical, so we'll continue
    }
    
    // Return success response even if populate failed
    return NextResponse.json(savedTokenizedJob, { status: 201 });
  } catch (error) {
    console.error('Error creating tokenized job:', error);
    
    // Check if the job was actually saved despite the error
    if (error instanceof Error) {
      console.error('Error details:', error.message, error.stack);
    }
    
    try {
      // Try to check if the job was actually tokenized despite the error
      const body = await request.json().catch(() => ({}));
      const { jobId } = body;
      
      if (jobId) {
        const existingTokenizedJob = await TokenizedJob.findOne({ jobId }).catch(() => null);
        if (existingTokenizedJob) {
          console.log('Job was actually tokenized despite error:', existingTokenizedJob._id);
          return NextResponse.json(existingTokenizedJob, { status: 201 });
        }
      }
    } catch (checkError) {
      console.error('Error checking if job was tokenized:', checkError);
    }
    
    return NextResponse.json({ error: 'Failed to create tokenized job' }, { status: 500 });
  }
}
