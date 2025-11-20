import mongoose from "mongoose";

const uri = process.env.MONGODB_URI!;
if (!uri) {
    throw new Error("MONGODB_URI is missing");
}

let cached = (global as any).mongoose;
if (!cached) {
    cached = (global as any).mongoose = {
        conn : null,
        promise : null
    };
}

export async function connectDB() {
    if(cached.conn) return cached.conn;
    if(!cached.promise) {
        cached.promise = mongoose.connect(uri)
    }

    cached.conn = await cached.promise;
    return cached.conn;
}
