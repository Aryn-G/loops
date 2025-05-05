import { config } from "dotenv";
config({ path: ".env.local" });

import { confirm, search, select } from "@inquirer/prompts";
import { ServerApiVersion } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";
import Users, { IUsers } from "../src/app/_db/models/Users";

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
  console.log("Updating all Users...");

  await Users.updateMany({}, { $set: { linked: true, deleted: false } });

  console.log("Success!");
  process.exit(0);
}

main();
