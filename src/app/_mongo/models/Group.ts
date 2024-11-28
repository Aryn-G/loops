import mongoose from "mongoose";

export interface IGroup extends mongoose.Document {
  users: string[];
  name: string;
  deleted: boolean;
}

const GroupSchema = new mongoose.Schema<IGroup>({
  users: {
    type: [String],
    default: [],
  },
  name: {
    type: String,
    required: true,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
});

export default mongoose.models.Group ||
  mongoose.model<IGroup>("Group", GroupSchema);
