"use server";

import mongoDB from "@/app/_db/connect";
import Loop from "@/app/_db/models/Loop";
import { toISOStringOffset } from "@/app/_lib/time";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export async function createLoopAction(
  prevState: any,
  formData: FormData
): Promise<{ [key: string]: string }> {
  await mongoDB();

  const session = await auth();
  if (!session?.user || session?.user?.role === "Student")
    return { overall: "Error: Permission Denied" };

  const createdBy = session.user.id;

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

    const newLoop = new Loop({
      createdBy,
      loopNumber,
      title,
      description,
      capacity,
      departureDateTime,
      departureLocation: departureLoc,
      pickUpDateTime,
      pickUpLocation: pickUpLoc ?? "",
      approxDriveTime,
      reservations,
      signUpOpenDateTime,
      createdAt: new Date(),
    });

    await newLoop.save();
    revalidateTag("loopsTag");
  } catch (error: any) {
    if (typeof error === "string") return { overall: error };
    return { overall: "Internal Error" };
  }

  return { overall: "success" };
}

export async function removeLoop(prevState: any, formData: FormData) {
  await mongoDB();

  const loop = formData.get("loop");
  try {
    if (!loop) return "Error: Invalid Form Submission";

    const loopDoc = await Loop.findOne(
      { _id: loop }
      // { $set: { deleted: { $not: "$deleted" } } }
    );
    if (!loopDoc) return "Error";

    loopDoc.deleted = !loopDoc.deleted;
    await loopDoc.save();
    revalidateTag("loopsTag");
  } catch (error) {
    return "Internal Error";
  }

  return "Success";
}
