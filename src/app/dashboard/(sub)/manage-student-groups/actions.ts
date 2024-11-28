"use server";

import mongoDB from "@/app/_mongo/connect";
import Group from "@/app/_mongo/models/Group";
import { revalidateTag } from "next/cache";

export async function createGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const name = formData.get("name");
  const users = formData.getAll("users");

  try {
    const newGroup = new Group({
      name,
      users,
    });

    await newGroup.save();
    revalidateTag("groups");
  } catch (error) {
    return error;
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
    await Group.updateOne({ _id: group }, { $set: { deleted: true } });
    revalidateTag("groups");
  } catch (error) {
    return error;
  }

  return "Success";
}
