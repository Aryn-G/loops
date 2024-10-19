import mongoose, { Schema } from "mongoose";

export interface IUser extends mongoose.Document {
  email: string;
  name: string;
  photoUrl?: string;
  permissions?: "Student" | "Loops" | "Admin";
}

const UserSchema = new mongoose.Schema<IUser>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photoUrl: {
    type: String,
  },
  permissions: {
    type: String,
    enum: ["Student", "Loops", "Admin"],
    default: "Student",
  },
});

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
