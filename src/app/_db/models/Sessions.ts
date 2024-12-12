import mongoose from "mongoose";

export interface ISessions extends mongoose.Document {
  sessionToken: string;
  userId: mongoose.Types.ObjectId;
  expires: Date;
  createdAt: Date;
  updatedAt: Date;
  browser: string;
  device: string;
  deviceVendor?: string;
  deviceModel?: string;
  os: string;
  location: string;
  ip: string;
}

const SessionsSchema = new mongoose.Schema<ISessions>(
  {
    sessionToken: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.ObjectId,
      ref: "Users",
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    createdAt: {
      type: Date,
      // required: true,
    },
    updatedAt: {
      type: Date,
      // required: true,
    },
    browser: {
      type: String,
    },
    device: {
      type: String,
    },
    deviceVendor: {
      type: String,
    },
    deviceModel: {
      type: String,
    },
    os: {
      type: String,
    },
    ip: {
      type: String,
    },
    location: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Sessions ||
  mongoose.model<ISessions>("Sessions", SessionsSchema);
