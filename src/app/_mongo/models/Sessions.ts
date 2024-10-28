import mongoose, { Schema } from "mongoose";

export interface ISessions extends mongoose.Document {}

const SessionsSchema = new mongoose.Schema<ISessions>({});

export default mongoose.models.Sessions ||
  mongoose.model<ISessions>("Sessions", SessionsSchema);
