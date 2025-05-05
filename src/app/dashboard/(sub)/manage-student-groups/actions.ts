"use server";

import mongoDB from "@/app/_db/connect";
import Group, { IGroup } from "@/app/_db/models/Group";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

export async function createGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const name = formData.get("name");
  const users = formData.getAll("users");
  const subgroups = formData.getAll("subgroups");

  try {
    if (!name) return "Error: Invalid Form Submission";
    const newGroup = new Group({
      name,
      users,
      subgroups,
    });

    await newGroup.save();
    revalidateTag("groups");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function removeFromGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  const remove = formData.getAll("remove");
  //   console.log(selected);
  try {
    await Group.updateOne(
      { _id: group },
      { $pull: { users: { $in: remove } } }
    );
    revalidateTag("groups");
  } catch (error) {
    return error;
  }

  return "Success";
}

export async function removeGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  //   console.log(selected);
  try {
    if (!group) return "Error: Invalid Form Submission";
    const groupDoc = await Group.findOne({ _id: group });
    if (!groupDoc) return "Couldn't find group";
    groupDoc.deleted = !groupDoc.deleted;
    await groupDoc.save();
    revalidateTag("groups");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}
