import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Job from '@/models/Job';
import { verifyToken } from '@/lib/auth';

// GET /api/jobs - Get all jobs
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    
    // Get search parameters from URL
    const url = new URL(req.url);
    const searchQuery = url.searchParams.get('search') || '';
    const category = url.searchParams.get('category') || '';
    
    // Build the query
    const query: any = {};
    
    // Add search query if provided
    if (searchQuery) {
      // Search in title and description
      query.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { description: { $regex: searchQuery, $options: 'i' } }
      ];
    }
    
    // Add category filter if provided
    if (category && category !== 'All') {
      query.category = category;
    }
    
    console.log('Search query:', JSON.stringify(query));
    
    // Get the 20 most recent jobs that match the query
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    
    return NextResponse.json(jobs, { status: 200 });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}

// POST /api/jobs - Create a new job
export async function POST(req: NextRequest) {
  try {
    // Get the token from the Authorization header
    const authHeader = req.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    await dbConnect();
    
    const data = await req.json();
    
    // Create the job
    const job = await Job.create({
      ...data,
      createdBy: payload.id,
    });
    
    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    // If it's a validation error, return the specific error message
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message || 'Failed to create job' },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
