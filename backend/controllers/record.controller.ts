import { Response } from "express";
import Record from "../models/Record";
import Message from "../models/Messsage";
import { AuthRequest } from "../middleware/auth";

const computeStatus = (amount: number, repaid: number) => {
  if (repaid <= 0) return "pending";
  if (repaid >= amount) return "paid";
  return "partial";
};

export const createRecord = async (req: AuthRequest, res: Response) => {
  const { type, personName, amount, reason, date } = req.body;
  const record = await Record.create({
    user: req.userId!,
    type, personName, amount, reason, date: new Date(date),
  });
  await Message.create({
    user: req.userId!,
    title: `New ${type} record created`,
    body: `${type === "lent" ? "Lent" : "Borrowed"} ${amount} ETB ${type === "lent" ? "to" : "from"} ${personName}.`,
  });
  res.status(201).json(record);
};

export const listRecords = async (req: AuthRequest, res: Response) => {
  const { type, status } = req.query;
  const filter: any = { user: req.userId };
  if (type) filter.type = type;
  if (status) filter.status = status;
  const records = await Record.find(filter).sort({ date: -1 });
  res.json(records);
};

export const getRecord = async (req: AuthRequest, res: Response) => {
  const record = await Record.findOne({ _id: req.params.id, user: req.userId });
  if (!record) return res.status(404).json({ message: "Record not found" });
  res.json(record);
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
  const record = await Record.findOne({ _id: req.params.id, user: req.userId });
  if (!record) return res.status(404).json({ message: "Record not found" });

  const { personName, amount, reason, date, repaidAmount } = req.body;
  if (personName) record.personName = personName;
  if (reason) record.reason = reason;
  if (date) record.date = new Date(date);
  if (typeof amount === "number") record.amount = amount;
  if (typeof repaidAmount === "number") record.repaidAmount = repaidAmount;
  record.status = computeStatus(record.amount, record.repaidAmount) as any;

  await record.save();
  res.json(record);
};

export const repayRecord = async (req: AuthRequest, res: Response) => {
  const { amount } = req.body;
  const record = await Record.findOne({ _id: req.params.id, user: req.userId });
  if (!record) return res.status(404).json({ message: "Record not found" });

  record.repaidAmount = Math.min(record.amount, record.repaidAmount + amount);
  record.status = computeStatus(record.amount, record.repaidAmount) as any;
  await record.save();

  await Message.create({
    user: req.userId!,
    title: record.status === "paid" ? "Record fully repaid ✅" : "Partial repayment recorded",
    body: `${amount} ETB repaid for ${record.personName}. Remaining: ${record.amount - record.repaidAmount} ETB.`,
  });

  res.json(record);
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  const record = await Record.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!record) return res.status(404).json({ message: "Record not found" });
  res.json({ message: "Deleted" });
};

export const summary = async (req: AuthRequest, res: Response) => {
  const records = await Record.find({ user: req.userId });
  let totalLent = 0, totalBorrowed = 0, owedToMe = 0, iOwe = 0;

  for (const r of records) {
    const remaining = Math.max(0, r.amount - r.repaidAmount);
    if (r.type === "lent") { totalLent += r.amount; owedToMe += remaining; }
    else { totalBorrowed += r.amount; iOwe += remaining; }
  }
  res.json({ totalLent, totalBorrowed, owedToMe, iOwe, count: records.length });
};