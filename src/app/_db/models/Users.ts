import mongoose from "mongoose";

export interface IUsers extends mongoose.Document {
  email: string;
  name: string;
  picture?: string;
  role?: "Student" | "Loops" | "Admin";
}

const UsersSchema = new mongoose.Schema<IUsers>({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
  },
  role: {
    type: String,
    enum: ["Student", "Loops", "Admin"],
    default: "Student",
  },
});

export default mongoose.models.Users ||
  mongoose.model<IUsers>("Users", UsersSchema);
