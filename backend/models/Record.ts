import { Schema, model, Document, Types } from "mongoose";

export type RecordType = "lent" | "borrowed";

export interface IRecord extends Document {
  user: Types.ObjectId;
  type: RecordType;
  personName: string;
  amount: number;
  reason: string;
  date: Date;
  repaidAmount: number;
  status: "pending" | "partial" | "paid";
  createdAt: Date;
  updatedAt: Date;
}

const recordSchema = new Schema<IRecord>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["lent", "borrowed"], required: true },
    personName: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0.01 },
    reason: { type: String, required: true, trim: true },
    date: { type: Date, required: true },
    repaidAmount: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["pending", "partial", "paid"], default: "pending" },
  },
  { timestamps: true }
);

// virtual: remaining balance
recordSchema.virtual("remaining").get(function (this: IRecord) {
  return Math.max(0, this.amount - this.repaidAmount);
});

recordSchema.set("toJSON", { virtuals: true });

export default model<IRecord>("Record", recordSchema);