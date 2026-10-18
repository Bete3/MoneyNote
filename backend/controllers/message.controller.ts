import { Response } from "express";
import Message from "../models/Messsage";
import { AuthRequest } from "../middleware/auth";

export const listMessages = async (req: AuthRequest, res: Response) => {
  const messages = await Message.find({ user: req.userId }).sort({ createdAt: -1 }).limit(50);
  res.json(messages);
};

export const markRead = async (req: AuthRequest, res: Response) => {
  const msg = await Message.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { read: true },
    { new: true }
  );
  if (!msg) return res.status(404).json({ message: "Message not found" });
  res.json(msg);
};

export const markAllRead = async (req: AuthRequest, res: Response) => {
  await Message.updateMany({ user: req.userId, read: false }, { read: true });
  res.json({ message: "All messages marked as read" });
};