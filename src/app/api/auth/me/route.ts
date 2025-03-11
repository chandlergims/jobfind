import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    console.log('Auth/me request received');
    
    // Get the token from the Authorization header
    const authHeader = request.headers.get('Authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No valid Authorization header found');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    console.log('Token extracted from header');
    
    // Verify the token
    console.log('Verifying token...');
    const payload = verifyToken(token);
    
    if (!payload) {
      console.error('Token verification failed');
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }
    
    console.log('Token verified, payload:', { id: payload.id, walletAddress: payload.walletAddress });

    // Connect to the database
    try {
      console.log('Connecting to database...');
      await dbConnect();
      console.log('Connected to database');
    } catch (dbError: any) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: `Database connection error: ${dbError.message}` },
        { status: 500 }
      );
    }

    // Find the user
    let user;
    try {
      // Try to find by ID first
      console.log(`Looking for user with ID: ${payload.id}`);
      user = await UserModel.findById(payload.id);

      if (!user) {
        // If user not found by ID, try finding by wallet address
        console.log(`User with ID ${payload.id} not found, trying wallet address: ${payload.walletAddress}`);
        user = await UserModel.findOne({ walletAddress: payload.walletAddress });
        
        if (!user) {
          console.error(`User not found with ID or wallet address`);
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        console.log('User found by wallet address:', user._id.toString());
      } else {
        console.log('User found by ID:', user._id.toString());
      }
    } catch (userError: any) {
      console.error('Error finding user:', userError);
      
      // Try one more time with wallet address only
      try {
        console.log('Trying one more time with wallet address only');
        user = await UserModel.findOne({ walletAddress: payload.walletAddress });
        
        if (!user) {
          console.error('Still could not find user');
          return NextResponse.json(
            { error: 'User not found' },
            { status: 404 }
          );
        }
        
        console.log('User found on retry:', user._id.toString());
      } catch (retryError: any) {
        console.error('Error on retry:', retryError);
        return NextResponse.json(
          { error: `User error: ${userError.message}` },
          { status: 500 }
        );
      }
    }

    // Return user data
    const response = {
      user: {
        id: user._id.toString(),
        walletAddress: user.walletAddress,
        name: user.name || null,
        email: user.email || null,
        profilePicture: user.profilePicture || null,
        createdAt: user.createdAt,
      },
    };
    
    console.log('Returning user data');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: `Authentication failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
