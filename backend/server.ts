
import dotenv from "dotenv";
dotenv.config();
import { createApp } from "./app";
import { connectDB } from "./config/db";

const PORT = process.env.PORT || 5000;
const mongoUri = process.env.MONGO_URI;

const app = createApp();
const server = app.listen(PORT, () => {
  console.log(`🚀 Server on :${PORT}`);
});

(async () => {
  try {
    await connectDB(mongoUri ?? "");
  } catch (err) {
    console.error("❌ Backend startup failed:", err instanceof Error ? err.message : err);
    console.error("ℹ️ Swagger remains available at /api/docs; database endpoints return 503 until MongoDB is available.");
  }
})();
