import { Schema, model, Document, Types } from "mongoose";

export interface IMessage extends Document {
  user: Types.ObjectId;
  title: string;
  body: string;
  read: boolean;
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default model<IMessage>("Message", messageSchema);