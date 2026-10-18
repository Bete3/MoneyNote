import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const requireDatabase = (_req: Request, res: Response, next: NextFunction) => {
  if (mongoose.connection.readyState === 1) {
    return next();
  }

  return res.status(503).json({
    message: "Database is unavailable. Check the MongoDB Atlas cluster and Network Access IP list.",
  });
};
