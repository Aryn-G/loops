import mongoose from "mongoose";

export interface IVerificationTokens extends mongoose.Document {}

const VerificationTokensSchema = new mongoose.Schema<IVerificationTokens>({});

export default mongoose.models.VerificationTokens ||
  mongoose.model<IVerificationTokens>(
    "VerificationTokens",
    VerificationTokensSchema
  );
