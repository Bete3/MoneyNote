import mongoose from "mongoose";

export const connectDB = async (uri: string) => {
  if (!uri.trim()) {
    throw new Error("MONGO_URI is not configured.");
  }

  try {
    await mongoose.connect(uri, {
      connectTimeoutMS: 10_000,
      serverSelectionTimeoutMS: 10_000,
    });
    console.log("✅ MongoDB connected");
  } catch (error) {
    if (error instanceof Error && error.message.includes("ETIMEDOUT")) {
      throw new Error(
        "MongoDB connection timed out. If you use MongoDB Atlas, add this computer's public IP address to the project's Network Access IP list and verify that the cluster is running.",
      );
    }

    throw error;
  }
};
