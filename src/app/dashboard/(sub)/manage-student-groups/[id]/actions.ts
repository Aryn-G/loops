"use server";

import mongoDB from "@/app/_db/connect";
import Group, { IGroup } from "@/app/_db/models/Group";
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
    console.log("Internal Error");
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
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

function wouldCauseAnyCycle(
  parentId: string,
  subgroupIds: string[],
  groupMap: Map<string, IGroup>
): boolean {
  if (subgroupIds.includes(parentId)) {
    return true;
  }

  function dfs(currentId: string, visited = new Set<string>()): boolean {
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const group = groupMap.get(currentId);
    if (!group) return false;

    for (const sub of group.subgroups) {
      const subStr = sub.toString();
      if (subStr === parentId) return true;
      if (dfs(subStr, visited)) return true;
    }

    return false;
  }

  for (const subId of subgroupIds) {
    if (dfs(subId.toString())) return true;
  }

  return false;
}

export async function addSubgroups(prevState: any, formData: FormData) {
  const group = formData.get("group")?.toString();
  const subgroupIds = formData.getAll("selected").map((s) => s?.toString());

  try {
    const allGroups = await Group.find<IGroup>();
    const groupMap = new Map(allGroups.map((g) => [String(g._id), g]));

    if (wouldCauseAnyCycle(String(group), subgroupIds, groupMap)) {
      return "Error: Cycle detected. Cannot add subgroups.";
    }

    const parent = await Group.findById<IGroup>(group);
    if (!parent) return "Internal Error";

    for (const subId of subgroupIds) {
      if (!parent.subgroups.some((id) => id.equals(subId))) {
        parent.subgroups.push(new ObjectId(subId));
      }
    }

    await parent.save();
    revalidateTag("groups");
  } catch (error) {
    if (typeof error === "string") return error;
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function removeSubgroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  const remove = formData.get("remove");
  //   console.log(selected);
  try {
    // console.log(remove);
    if (!group || !remove) return "Error: Invalid Form Submission";

    await Group.findByIdAndUpdate(group, {
      $pull: { subgroups: new ObjectId(remove?.toString()) },
    });

    revalidateTag("groups");
  } catch (error) {
    // console.log(error);
    console.log("Internal Error");
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
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function multiRemoveFromGroup(prevState: any, formData: FormData) {
  await mongoDB();

  const group = formData.get("group");
  const remove = formData.getAll("remove");
  //   console.log(selected);
  try {
    // console.log(remove);
    if (!group || !remove) return "Error: Invalid Form Submission";

    await Group.findByIdAndUpdate(group, {
      $pull: { users: { $in: remove } },
    });

    revalidateTag("groups");
  } catch (error) {
    // console.log(error);
    console.log(error);
    return "Internal Error";
  }

  return "Success";
}
