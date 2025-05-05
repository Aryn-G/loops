import mongoose from "mongoose";

export interface IUsers extends mongoose.Document {
  email: string;
  name?: string;
  picture?: string;
  role?: "No" | "Student" | "Loops" | "Admin";
  linked: boolean;
  deleted: boolean;
}

const UsersSchema = new mongoose.Schema<IUsers>({
  name: {
    type: String,
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
    enum: ["No", "Student", "Loops", "Admin"],
    default: "No",
  },
  linked: {
    type: Boolean,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Users ||
  mongoose.model<IUsers>("Users", UsersSchema);
