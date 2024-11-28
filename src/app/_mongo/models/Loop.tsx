import mongoose from "mongoose";

export type LoopData = {
  // loopNumber?: number;
  date: Date;
  title: string;
  description: string;
  departureTime: string;
  departureLocation: string;
  pickUpTime: string;
  pickUpLocation?: string;
  approxDriveTime: number;
  capacity: number;
  reservations: {
    slots?: number;
    group?: string;
  }[];

  filled?: [mongoose.Types.ObjectId];
};

export interface ILoop extends LoopData, mongoose.Document {
  createdBy: mongoose.Types.ObjectId;
}

const LoopSchema = new mongoose.Schema<ILoop>({
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "Users",
    required: true,
  },
  // loopNumber: { type: Number, required: true, default: 0 },
  date: { type: Date, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  departureTime: { type: String, required: true },
  departureLocation: { type: String, required: true },
  pickUpTime: { type: String, required: true },
  pickUpLocation: { type: String, default: "", required: false },
  approxDriveTime: { type: Number, required: true },
  capacity: { type: Number, required: true },
  filled: {
    type: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
    default: [],
  },
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
});

export default mongoose.models.Loop ||
  mongoose.model<ILoop>("Loop", LoopSchema);
