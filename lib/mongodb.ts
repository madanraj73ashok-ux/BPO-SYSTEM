import mongoose from 'mongoose'

type MongooseCache = {
  conn: typeof mongoose | null
  promise: Promise<typeof mongoose> | null
}

const globalWithMongoose = global as typeof globalThis & {
  mongooseCache?: MongooseCache
}

const cached = globalWithMongoose.mongooseCache ?? {
  conn: null,
  promise: null,
}

globalWithMongoose.mongooseCache = cached

function getMongoUri() {
  const mongoUri = process.env.MONGODB_URI

  if (!mongoUri) {
    throw new Error('Please define the MONGODB_URI environment variable in .env.local')
  }

  if (
    mongoUri.startsWith('MONGODB_URI=') ||
    mongoUri.includes('USERNAME:PASSWORD') ||
    mongoUri.includes('YOUR_PASSWORD') ||
    mongoUri.includes('CLUSTER.mongodb.net') ||
    mongoUri.includes('0.0.0.0/0.mongodb.net')
  ) {
    throw new Error(
      'Replace the placeholder MONGODB_URI in .env.local with your real MongoDB Atlas connection string',
    )
  }

  return mongoUri
}

export async function connectMongoDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(getMongoUri(), {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }).catch((error) => {
      cached.promise = null
      throw error
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}
