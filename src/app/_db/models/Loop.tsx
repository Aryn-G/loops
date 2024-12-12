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
    group?: string;
  }[];
  filled: any[];
  signUpOpenDateTime: string;
  deleted: boolean;
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
  loopNumber: { type: Number, required: true, default: 0 },
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
    type: [{ type: mongoose.Types.ObjectId, ref: "SignUp" }],
    default: [],
  },
  signUpOpenDateTime: { type: Date, required: true },
  deleted: {
    type: Boolean,
    default: false,
  },
  createdAt: { type: Date, required: true },
});

export default mongoose.models.Loop ||
  mongoose.model<ILoop>("Loop", LoopSchema);
