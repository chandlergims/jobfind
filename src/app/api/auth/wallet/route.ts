import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    console.log('Wallet authentication request received');
    
    // Parse request body
    let body;
    try {
      body = await request.json();
      console.log('Request body:', body);
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    const { walletAddress } = body;

    if (!walletAddress) {
      console.error('Wallet address is missing in request');
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      );
    }

    console.log(`Authenticating wallet address: ${walletAddress}`);
    
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

    // Find or create user - with super simplified approach
    let user;
    
    try {
      // First, try to find the user
      console.log('Looking for existing user with wallet address:', walletAddress);
      user = await UserModel.findOne({ walletAddress });
      
      if (user) {
        // User exists, just log it
        console.log('Existing user found:', user._id.toString());
      } else {
        // User doesn't exist, create a new one
        console.log('User not found, creating new user');
        
        // Create a new user with just the wallet address
        user = new UserModel({ walletAddress });
        await user.save();
        console.log('New user created:', user._id.toString());
      }
    } catch (userError: any) {
      console.error('Error finding/creating user:', userError);
      
      // Try one more time to find the user
      try {
        console.log('Trying one more time to find user');
        user = await UserModel.findOne({ walletAddress });
        
        if (!user) {
          console.error('Still could not find user');
          return NextResponse.json(
            { error: 'Could not create or find user' },
            { status: 500 }
          );
        }
        
        console.log('Found user on retry:', user._id.toString());
      } catch (retryError: any) {
        console.error('Error on retry:', retryError);
        return NextResponse.json(
          { error: `User error: ${userError.message}` },
          { status: 500 }
        );
      }
    }

    // Generate JWT token
    let token;
    try {
      console.log('Generating token...');
      token = generateToken(user);
      console.log('Token generated');
    } catch (tokenError: any) {
      console.error('Error generating token:', tokenError);
      return NextResponse.json(
        { error: `Token generation error: ${tokenError.message}` },
        { status: 500 }
      );
    }

    // Return user and token
    const response = {
      user: {
        id: user._id.toString(),
        walletAddress: user.walletAddress,
        name: user.name || null,
        email: user.email || null,
        profilePicture: user.profilePicture || null,
      },
      token,
    };
    
    console.log('Authentication successful, returning response');
    return NextResponse.json(response);
  } catch (error: any) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: `Authentication failed: ${error.message || 'Unknown error'}` },
      { status: 500 }
    );
  }
}
