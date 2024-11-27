import mongoose from "mongoose";

export interface IAccounts extends mongoose.Document {}

const AccountsSchema = new mongoose.Schema<IAccounts>({});

export default mongoose.models.Accounts ||
  mongoose.model<IAccounts>("Accounts", AccountsSchema);
