import mongoose, { ObjectId, PopulatedDoc } from "mongoose";
import { ISessions } from "./Sessions";

export interface ISubscription extends mongoose.Document {
  session: PopulatedDoc<mongoose.Document<ObjectId> & ISessions>;
  endpoint: string;
  keys: { p256dh: string; auth: string };
  // data: any;
  createdAt: Date;
}

const SubscriptionSchema = new mongoose.Schema<ISubscription>({
  session: {
    type: mongoose.Schema.ObjectId,
    ref: "Sessions",
    required: true,
  },
  endpoint: { type: String, required: true, unique: true },
  keys: {
    p256dh: { type: String, required: true },
    auth: { type: String, required: true },
  },
  // data: { required: true },
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

export default mongoose.models.Subscription ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);
