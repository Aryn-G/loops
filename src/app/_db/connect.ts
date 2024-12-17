import { ServerApiVersion } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";

declare global {
  var mongoose: any;
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

let cached: {
  conn?: mongoose.Mongoose | null;
  promise?: Promise<mongoose.Mongoose> | null;
} = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Ensure MongoDB Connection is Established
 * @returns
 */
export default async function mongoDB(): Promise<mongoose.Mongoose> {
  // if already connected, return connection
  if (cached.conn) {
    return cached.conn;
  }
  // else if not already trying to connect, try to connect
  if (!cached.promise) {
    const opts: ConnectOptions = {
      bufferCommands: false,
      serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
      },
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  // try to connect
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  // return connection
  return cached.conn;
}

/**
 * Get raw MongoDB Client
 * @returns Raw MongoDB Client
 */
export async function getMongoDBClient() {
  await mongoDB();
  const db = cached.conn?.connection.getClient();
  return db;
}
