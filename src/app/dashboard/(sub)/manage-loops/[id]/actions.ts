"use server";

import { getGroups } from "@/app/_db/queries/groups";
import { getLoop } from "@/app/_db/queries/loops";
import { signUpMany } from "@/app/_lib/signups";
import mongoDB from "@/app/_db/connect";
import Group, { IGroup } from "@/app/_db/models/Group";
import Loop, { ILoop } from "@/app/_db/models/Loop";
import SignUp, { ISignUp } from "@/app/_db/models/SignUp";
import Users from "@/app/_db/models/Users";
import { ObjectId } from "mongodb";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { toDateWithOffset } from "@/app/_lib/time";

export async function editLoopSignUps(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop")?.toString();
  const selected = formData.getAll("selected").map((s) => s?.toString());

  try {
    if (!selected.length) return "Error: Invalid Submission. Nothing to Add";
    if (!loop) return "Error: Invalid Submission";
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
    if (!loopDoc) return "Error: no loop";

    const allGroups = await Group.find<IGroup>({ deleted: false });

    const { result, errors } = await signUpMany(
      loopDoc as any,
      selected,
      allGroups as any
    );

    const many = result.map((m) => ({ ...m, createdAt: new Date() }));

    if (!many.length) return errors.join(", ");

    const docs = await SignUp.insertMany<ISignUp>(many);

    const docIds = docs.map((d) => d._id);

    await Loop.findByIdAndUpdate(loop, {
      $push: { filled: { $each: docIds } },
    });
    if (many.length < selected.length) return errors.join(", ");

    revalidateTag("loopsTag");
    revalidateTag("groups");
    revalidateTag("signups");
  } catch (error) {
    if (typeof error === "string") return error;
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function froceLoopSignUps(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop")?.toString();
  const selected = formData.getAll("selected").map((s) => s?.toString());

  try {
    if (!selected.length) return "Error: Invalid Submission. Nothing to Add";
    if (!loop) return "Error: Invalid Submission";

    const docs = await SignUp.insertMany<ISignUp>(
      selected.map((s) => ({
        user: s,
        loop: loop,
        createdAt: new Date(),
      }))
    );

    const docIds = docs.map((d) => d._id);

    await Loop.findByIdAndUpdate(loop, {
      $push: { filled: { $each: docIds } },
    });

    revalidateTag("loopsTag");
    revalidateTag("groups");
    revalidateTag("signups");
  } catch (error) {
    if (typeof error === "string") return error;
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function removeFromLoop(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop");
  const remove = formData.get("remove");
  try {
    if (!loop) return "Error: Invalid Form Submission";
    if (!remove) return "Error: Invalid Form Submission";

    await Loop.findByIdAndUpdate(loop, {
      $pull: { filled: new ObjectId(remove?.toString()) },
    });
    await SignUp.findByIdAndDelete(remove);

    revalidateTag("loopsTag");
  } catch (error) {
    if (typeof error === "string") return error;
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function multiRemoveFromLoop(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop");
  const remove = formData.getAll("remove");
  try {
    if (!loop) return "Error: Invalid Form Submission";
    if (!remove) return "Error: Invalid Form Submission";

    await Loop.findByIdAndUpdate(loop, {
      $pull: { filled: { $in: remove } },
    });
    await SignUp.deleteMany({ _id: { $in: remove } });

    revalidateTag("loopsTag");
  } catch (error) {
    if (typeof error === "string") return error;
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}

export async function editLoopAction(
  prevState: any,
  formData: FormData
): Promise<{ [key: string]: string }> {
  await mongoDB();

  const session = await auth();
  if (!session?.user || session?.user?.role === "Student")
    return { overall: "Error: Permission Denied" };

  const createdBy = session.user.id;

  const loop = formData.get("loop");
  const timezone = formData.get("timezone");

  const loopNumber = formData.get("loopNumber");
  const title = formData.get("title");
  const description = formData.get("description");
  const capacity = formData.get("capacity");
  const departureDateTime = formData.get("departureDateTime");
  const departureLoc = formData.get("departureLoc");
  const pickUpDateTime = formData.get("pickUpDateTime");
  const pickUpLoc = formData.get("pickUpLoc");
  const approxDriveTime = formData.get("approxDriveTime");

  const res = formData.getAll("reservations");
  const signUpOpenDateTime = formData.get("signUpOpenDateTime");

  const reservations: {
    group: FormDataEntryValue | null;
    slots: FormDataEntryValue | null;
  }[] = [];

  let totalSlots = 0;

  res.forEach((id, i) => {
    reservations.push({
      group: formData.get("reservationGroup" + id),
      slots: formData.get("reservationSlots" + id),
    });
    totalSlots += Number(reservations[i].slots);
  });

  try {
    if (!loop || !timezone) throw new Error("Error: Invalid Form Submission");

    if (
      !title ||
      !description ||
      !capacity ||
      !departureDateTime ||
      !departureLoc ||
      !pickUpDateTime ||
      !approxDriveTime
    )
      throw new Error("Error: Incomplete Form Submission");

    if (totalSlots > Number(capacity))
      throw new Error("Error: Cannot Reserve More Slots than Capacity");

    const departureD = toDateWithOffset(
      departureDateTime.toString(),
      Number(timezone)
    );
    const pickUpD = toDateWithOffset(
      pickUpDateTime.toString(),
      Number(timezone)
    );
    const signUpOpenD = !!signUpOpenDateTime
      ? toDateWithOffset(signUpOpenDateTime.toString(), Number(timezone))
      : undefined;

    console.log("Timezone: " + timezone);
    console.log("Form Departure Time: " + departureDateTime);
    console.log("Departure Time to DB: " + departureD);

    await Loop.findByIdAndUpdate(loop, {
      $set: {
        loopNumber,
        createdBy,
        title,
        description,
        capacity,
        departureDateTime: departureD,
        departureLocation: departureLoc,
        pickUpDateTime: pickUpD,
        pickUpLocation: pickUpLoc ?? "",
        approxDriveTime,
        reservations,
        signUpOpenDateTime: signUpOpenD,
      },
    });

    revalidateTag("loopsTag");
  } catch (error: any) {
    if (typeof error === "string") return { overall: error };
    return { overall: "Internal Error" };
  }

  return { overall: "success" };
}

export async function deleteLoop(prevState: any, formData: FormData) {
  await mongoDB();

  const remove = formData.get("remove");
  //   console.log(selected);
  try {
    if (!remove) return "Invalid Form Submission";
    await Loop.deleteMany({ _id: remove });
    revalidateTag("loopsTag");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}
