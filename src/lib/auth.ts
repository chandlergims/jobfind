import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export interface UserJwtPayload {
  id: string;
  walletAddress: string;
  iat?: number;
  exp?: number;
}

export function generateToken(user: { _id: string; walletAddress: string }): string {
  console.log('Generating token for user:', { id: user._id.toString(), walletAddress: user.walletAddress });
  
  const payload: UserJwtPayload = {
    id: user._id.toString(),
    walletAddress: user.walletAddress,
  };

  try {
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: '7d', // Token expires in 7 days
    });
    
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
}

export function verifyToken(token: string): UserJwtPayload | null {
  console.log('Verifying token...');
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as UserJwtPayload;
    console.log('Token verified successfully:', { id: decoded.id, walletAddress: decoded.walletAddress });
    return decoded;
  } catch (error) {
    console.error('Token verification failed:', error);
    return null;
  }
}
