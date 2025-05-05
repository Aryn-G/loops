import { config } from "dotenv";
config({ path: ".env.local" });

import { confirm, search, select } from "@inquirer/prompts";
import { ServerApiVersion } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";
import Loop, { ILoop } from "../src/app/_db/models/Loop";

async function main() {
  console.log("Connecting to MongoDB...");
  const MONGODB_URI = process.env.MONGODB_URI!;
  const opts: ConnectOptions = {
    bufferCommands: false,
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  };
  await mongoose.connect(MONGODB_URI, opts);
  console.log("Updating all Loops...");

  await Loop.updateMany({}, { $set: { published: true, canceled: false } });

  console.log("Success!");
  process.exit(0);
}

main();
