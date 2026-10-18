import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export const requireAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer "))
    return res.status(401).json({ message: "Unauthorized" });

  try {
    const payload = verifyToken(header.split(" ")[1]);
    req.userId = payload.id;
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};