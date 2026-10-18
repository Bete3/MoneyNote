import jwt from "jsonwebtoken";

export const signToken = (userId: string) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: (process.env.JWT_EXPIRES_IN || "7d") as jwt.SignOptions["expiresIn"],
  });

export const verifyToken = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };