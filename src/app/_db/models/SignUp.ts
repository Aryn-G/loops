import mongoose, { ObjectId, PopulatedDoc } from "mongoose";
import { ILoop } from "./Loop";
import { IUsers } from "./Users";
import { IGroup } from "./Group";

export interface ISignUp extends mongoose.Document {
  loop: PopulatedDoc<mongoose.Document<ObjectId> & ILoop>;
  user: PopulatedDoc<mongoose.Document<ObjectId> & IUsers>;
  group?: PopulatedDoc<mongoose.Document<ObjectId> & IGroup>;
  createdAt: Date;
}

const SignUpSchema = new mongoose.Schema<ISignUp>({
  loop: {
    type: mongoose.Schema.ObjectId,
    ref: "Loop",
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  group: {
    type: mongoose.Schema.ObjectId,
    ref: "Group",
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.models.SignUp ||
  mongoose.model<ISignUp>("SignUp", SignUpSchema);
