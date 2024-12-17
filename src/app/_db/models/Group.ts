import mongoose from "mongoose";

export interface IGroup extends mongoose.Document {
  users: mongoose.Types.ObjectId[];
  name: string;
  deleted: boolean;
}

const GroupSchema = new mongoose.Schema<IGroup>({
  users: {
    type: [mongoose.Schema.ObjectId],
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
