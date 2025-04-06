import { config } from "dotenv";
config({ path: ".env.local" });

import { confirm, search, select } from "@inquirer/prompts";
import { ServerApiVersion } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";
import Users, { IUsers } from "../src/app/_db/models/Users";

process.on("SIGINT", () => {
  console.log("\nClosing Terminal...");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Rejection:", reason);
  process.exit(1);
});

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
  console.log("Loading Users...");
  const allUsers = (await Users.find<IUsers>({})).map((user) => {
    return {
      _id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      picture: user.picture,
    };
  });

  const user = await search({
    message: "Search for a User to update:",
    source: async (input, { signal }) => {
      if (!input) {
        return [];
      }

      return allUsers
        .filter(
          (user) =>
            user.email.toLowerCase().includes(input.toLowerCase()) ||
            user.name.toLowerCase().includes(input.toLowerCase())
        )
        .map((user) => ({
          name: `(${user.role} Account) - ${user.name}`,
          value: user,
          description: `(${user.role} Account) - ${user.name} (${user.email})`,
        }));
    },
  });

  const updatedRole = await select({
    message: `Update selected user to:`,
    choices: [
      {
        name: "Student Account",
        value: "Student",
        description: "This is the default account type.",
      },
      {
        name: "Loops Account",
        value: "Loops",
        description: "This account can create loops and manage student groups.",
      },
      {
        name: "Admin Account",
        value: "Admin",
        description:
          "This account can create loops, manage student groups, and also manage Loops Accounts.",
      },
    ],
  });

  if (updatedRole === user.role) {
    console.log("Previous role and new role are the same.");
    process.exit(0);
  }

  let confirmation = true;
  if (updatedRole === "Admin") {
    confirmation = await confirm({
      message: "Are you sure you want to grant this account Admin permissions?",
      default: false,
    });
  }
  if (!confirmation) {
    console.log("Canceled!");
    process.exit(0);
  }

  await Users.findOneAndUpdate(
    { _id: user._id },
    { $set: { role: updatedRole } }
  );
  console.log("Success!");
  process.exit(0);
}

main();
