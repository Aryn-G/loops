import mongoose from "mongoose";

export type LoopData = {
  loopNumber: number;
  title: string;
  description: string;
  departureDateTime: string;
  departureLocation: string;
  pickUpDateTime: string;
  pickUpLocation?: string;
  approxDriveTime: number;
  capacity: number;
  reservations: {
    slots?: number;
    group?: string | mongoose.Types.ObjectId;
  }[];
  filled: any[];
  signUpOpenDateTime: string;
  published?: boolean;
  canceled?: boolean;
  deleted: boolean;
  createdBy?: mongoose.Types.ObjectId;
};

export interface ILoop
  extends Omit<
      LoopData,
      "departureDateTime" | "pickUpDateTime" | "signUpOpenDateTime" | "filled"
    >,
    mongoose.Document {
  createdBy: mongoose.Types.ObjectId;
  filled: mongoose.Types.ObjectId[];
  departureDateTime: Date;
  pickUpDateTime: Date;
  signUpOpenDateTime: Date;
  createdAt: Date;
}

const LoopSchema = new mongoose.Schema<ILoop>({
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  loopNumber: { type: Number, default: 0, required: false },
  // date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  departureDateTime: { type: Date, required: true },
  departureLocation: { type: String, required: true },
  pickUpDateTime: { type: Date, required: true },
  pickUpLocation: { type: String, default: "", required: false },
  approxDriveTime: { type: Number, required: true },
  capacity: { type: Number, required: true },
  reservations: {
    type: [
      {
        type: {
          slots: { type: Number },
          group: {
            type: mongoose.Schema.ObjectId,
            ref: "Group",
          },
        },
      },
    ],
    default: [],
  },
  filled: {
    type: [{ type: mongoose.Schema.ObjectId, ref: "SignUp" }],
    default: [],
  },
  signUpOpenDateTime: { type: Date, required: true },
  published: {
    type: Boolean,
    default: true,
  },
  canceled: {
    type: Boolean,
    default: false,
  },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, required: true },
});

export default mongoose.models.Loop ||
  mongoose.model<ILoop>("Loop", LoopSchema);
