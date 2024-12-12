"use server";

import mongoDB from "@/app/_db/connect";
import Group from "@/app/_db/models/Group";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function editGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  const name = formData.get("name");
  // const users = formData.getAll("users");

  try {
    if (!group || !name) return "Error: Invalid Form Submission";
    await Group.findByIdAndUpdate(group, { $set: { name } });
    revalidateTag("groups");
  } catch (error) {
    return "Internal Error";
  }

  // redirect("/dashboard/manage-student-groups");
  return "Success";
}

export async function addStudents(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group")?.toString();
  const selected = formData.getAll("selected").map((s) => s?.toString());

  try {
    if (!selected.length)
      throw new Error("Error: Invalid Submission. Nothing to Add");
    if (!group) throw new Error("Error: Invalid Submission");

    await Group.findByIdAndUpdate(group, {
      $push: { users: { $each: selected } },
    });

    revalidateTag("groups");
  } catch (error) {
    if (typeof error === "string") return error;
    return "Internal Error";
  }

  return "Success";
}

export async function removeFromGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  const remove = formData.get("remove");
  //   console.log(selected);
  try {
    // console.log(remove);
    if (!group || !remove) return "Error: Invalid Form Submission";

    await Group.findByIdAndUpdate(group, {
      $pull: { users: new ObjectId(remove?.toString()) },
    });

    revalidateTag("groups");
  } catch (error) {
    // console.log(error);
    return "Internal Error";
  }

  return "Success";
}
