import dns from "node:dns";
import mongoose from "mongoose";
const MONGODB_URI = process.env.MONGODB_URI;
if (process.env.NODE_ENV === "development") {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}
if (!MONGODB_URI) {
  throw new Error("Please add MONGODB_URI to .env.local");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    throw error;
  }

  return cached.conn;
}
