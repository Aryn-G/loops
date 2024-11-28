"use server";

import mongoDB from "@/app/_mongo/connect";
import Users from "@/app/_mongo/models/Users";
import { revalidateTag } from "next/cache";

export async function giveAccessAction(prevState: any, formData: FormData) {
  await mongoDB();

  const selected = formData.getAll("selected");
  //   console.log(selected);
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
  //   console.log(selected);
  try {
    await Users.updateOne({ _id: remove }, { $set: { role: "Student" } });
    revalidateTag("filteredUsers");
  } catch (error) {
    return error;
  }

  return "Success";
}
