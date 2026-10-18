
import { Request, Response } from "express";
import User from "../models/User";
import Message from "../models/Messsage";
import { hashPassword, comparePassword } from "../utils/password";
import { signToken } from "../utils/jwt";

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: "Email already registered" });

  const user = await User.create({
    name,
    email,
    password: await hashPassword(password),
  });

  await Message.create({
    user: user._id,
    title: "Welcome to MoneyNote 🎉",
    body: "Start tracking money you lend and borrow. Add your first record today!",
  });

  const token = signToken(user.id);
  res.status(201).json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password)))
    return res.status(401).json({ message: "Invalid credentials" });

  const token = signToken(user.id);
  res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
};

export const me = async (req: any, res: Response) => {
  const user = await User.findById(req.userId).select("-password");
  res.json({ user });
};
