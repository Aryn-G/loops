"use server";

import { signUpMany } from "@/app/_lib/signups";
import mongoDB from "@/app/_db/connect";
import Group, { IGroup } from "@/app/_db/models/Group";
import Loop, { ILoop } from "@/app/_db/models/Loop";
import SignUp, { ISignUp } from "@/app/_db/models/SignUp";
import { auth } from "@/auth";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";

export async function addSelfToLoop(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop")?.toString();
  const userId = formData.get("userId")?.toString();

  const session = await auth();
  if (!session) return "Error: Not Authenticated";

  try {
    if (!loop || !userId) return "Error: Invalid Form Submission";

    if (session.userId !== userId)
      throw new Error("Error: You can add remove your own signup");

    if (!loop) throw new Error("Error: Invalid Submission");

    const loopDoc = await Loop.findById<ILoop>(loop).populate([
      {
        path: "filled",
        select: "_id lood user group createdAt",
        model: SignUp,
        populate: [
          { path: "user", select: "name email _id picture" },
          { path: "group", select: "name _id" },
        ],
      },
      { path: "reservations.group", select: "name _id", model: Group },
    ]);
    if (!loopDoc) throw new Error("Error: no loop");
    if (loopDoc.deleted) return "Loop Deleted";

    const allGroups = await Group.find<IGroup>({ deleted: false });

    const { result, errors } = await signUpMany(
      loopDoc as any,
      [userId],
      allGroups as any
    );

    const many = result.map((m) => ({ ...m, createdAt: new Date() }));

    if (!many.length) return errors.join("");

    const docs = await SignUp.create<ISignUp>(many[0]);

    const docId = docs._id;

    await Loop.findByIdAndUpdate(loop, {
      $push: { filled: docId },
    });

    revalidateTag("loopsTag");
    revalidateTag("groups");
    revalidateTag("signups");
  } catch (error) {
    // console.log(error);
    if (typeof error === "string") return error;
    return "Internal Error";
  }

  return "Success";
}

export async function removeSelfFromLoop(prevState: any, formData: FormData) {
  await mongoDB();
  const session = await auth();
  if (!session) return "Error: Not Authenticated";

  const loop = formData.get("loop")?.toString();
  const remove = formData.get("remove")?.toString();

  try {
    if (!loop || !remove) return "Error: Invalid Form Submission";

    const signup = await SignUp.findById(remove);

    if (session.userId !== String(signup.user))
      throw new Error("Error: You can only remove your own signup");

    await Loop.findByIdAndUpdate(loop, {
      $pull: { filled: new ObjectId(remove) },
    });
    await SignUp.findByIdAndDelete(remove);

    revalidateTag("loopsTag");
    revalidateTag("signups");
  } catch (error) {
    console.log(error);
    return "Error";
  }

  return "Success";
}
