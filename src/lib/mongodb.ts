import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://link:JkGebcKbho5TvUu6@cluster0.hxfim.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

console.log('MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Log the URI with password hidden

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  initialized: boolean;
}

// @ts-ignore
let cached: MongooseCache = global.mongoose || { conn: null, promise: null, initialized: false };

// @ts-ignore
if (!global.mongoose) {
  // @ts-ignore
  global.mongoose = cached;
}

async function dbConnect() {
  try {
    console.log('Connecting to MongoDB...');
    
    if (cached.conn) {
      console.log('Using cached MongoDB connection');
      return cached.conn;
    }

    if (!cached.promise) {
      const opts = {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
        socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
      };

      console.log('Creating new MongoDB connection...');
      cached.promise = mongoose.connect(MONGODB_URI, opts)
        .then(async (mongoose) => {
          console.log('MongoDB connected successfully');
          
          // Force model recompilation
          console.log('Recompiling models...');
          if (mongoose.models.Job) {
            delete mongoose.models.Job;
          }
          if (mongoose.models.TokenizedJob) {
            delete mongoose.models.TokenizedJob;
          }
          if (mongoose.models.User) {
            delete mongoose.models.User;
          }
          
          // Drop collections if this is the first time connecting
          if (!cached.initialized) {
            try {
              console.log('Dropping existing collections...');
              
              // Check if the connection is established and db is available
              if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
                const db = mongoose.connection.db;
                
                // Get all collection names
                const collections = await db.listCollections().toArray();
                
                // Drop each collection
                for (const collection of collections) {
                  if (collection.name === 'users') {
                    console.log(`Dropping collection: ${collection.name}`);
                    await db.dropCollection(collection.name);
                  }
                }
                
                console.log('Collections dropped successfully');
              } else {
                console.log('Database connection not ready, skipping collection drop');
              }
              
              cached.initialized = true;
            } catch (dropError) {
              console.error('Error dropping collections:', dropError);
              // Continue even if dropping fails
            }
          }
          
          console.log('Models recompiled');
          return mongoose;
        })
        .catch((error) => {
          console.error('MongoDB connection error:', error);
          cached.promise = null; // Reset the promise on error
          throw error;
        });
    }
    
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (error) {
    console.error('Error in dbConnect:', error);
    throw error;
  }
}

// Test the connection
dbConnect()
  .then(() => console.log('Initial MongoDB connection test successful'))
  .catch((error) => console.error('Initial MongoDB connection test failed:', error));

export default dbConnect;
