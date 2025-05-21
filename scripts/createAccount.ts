import { config } from "dotenv";
config({ path: ".env.local" });

import { input } from "@inquirer/prompts";
import { ServerApiVersion } from "mongodb";
import mongoose, { ConnectOptions } from "mongoose";
import Users, { IUsers } from "../src/app/_db/models/Users";

const EMAIL_PATTERN =
  /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;

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

const extractEmails = (input: string) => {
  // @ts-ignore
  const emails = [...input.toLowerCase().matchAll(EMAIL_PATTERN)].map(
    (match) => match[0]
  );

  let remaining = input;
  for (const email of emails) {
    // Replace exact matches, globally
    remaining = remaining.replace(new RegExp(email, "g"), "").trim();
  }

  return {
    emails,
    remaining: remaining.replace(/\s+/g, " "), // normalize spaces
  };
};

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

  const inputted = await input({
    message: "Input emails seperated by spaces. ",
    required: true,
  });

  const { emails } = extractEmails(inputted);
  if (emails.length == 0) return console.log("No Valid Emails Entered.");

  const foundEmailDocs = await Users.find<IUsers>({
    email: { $in: emails },
  });
  const foundEmails = new Set(foundEmailDocs.map((doc) => doc.email));

  const newUsers = emails
    .filter((email) => !foundEmails.has(email.toString()))
    .map((email) => ({
      email,
      linked: false,
      deleted: false,
      role: "Student",
    }));

  if (newUsers.length > 0) {
    await Users.collection.insertMany(newUsers, { ordered: false });
  } else {
    console.log("Nothing new to create");
  }

  console.log("Success!");
  process.exit(0);
}

main();
