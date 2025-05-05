"use server";

import mongoDB from "@/app/_db/connect";
import Users, { IUsers } from "@/app/_db/models/Users";
import { revalidateTag } from "next/cache";

export async function giveAccessAction(prevState: any, formData: FormData) {
  await mongoDB();

  const selected = formData.getAll("selected");

  try {
    await Users.updateMany(
      { _id: { $in: selected } },
      { $set: { role: "Loops" } }
    );
    revalidateTag("filteredUsers");
  } catch (error) {
    return error;
  }

  return "Success";
}

export async function removeAccessAction(prevState: any, formData: FormData) {
  await mongoDB();

  const remove = formData.get("remove");

  try {
    if (!remove) return "Error: Invalid Submission";

    await Users.updateOne({ _id: remove }, { $set: { role: "Student" } });
    revalidateTag("filteredUsers");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function multiRemoveAccess(prevState: any, formData: FormData) {
  await mongoDB();
  let selected = formData.getAll("remove");

  try {
    await Users.updateMany({ _id: selected }, { $set: { role: "Student" } });
    revalidateTag("filteredUsers");
  } catch (error) {
    console.log(error);
    return "Internal Error";
  }

  return "Success";
}
