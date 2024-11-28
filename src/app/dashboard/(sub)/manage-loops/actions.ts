"use server";

import mongoDB from "@/app/_mongo/connect";
import Loop from "@/app/_mongo/models/Loop";
import { auth } from "@/auth";
import { revalidateTag } from "next/cache";

export async function createLoopAction(prevState: any, formData: FormData) {
  await mongoDB();

  // const createdBy = formData.get("userId");
  const session = await auth();

  // console.log(session);

  if (!session?.user || session?.user?.role === "Student")
    return "Error: Permission Denied";

  const createdBy = session.user.id;

  const date = formData.get("date");
  const title = formData.get("title");
  const description = formData.get("description");
  const capacity = formData.get("capacity");
  const departureTime = formData.get("departureTime");
  const departureLoc = formData.get("departureLoc");
  const pickUpTime = formData.get("pickUpTime");
  const pickUpLoc = formData.get("pickUpLoc");
  const approxDriveTime = formData.get("approxDriveTime");

  const res = formData.getAll("reservations");

  const reservations: {
    group: FormDataEntryValue | null;
    slots: FormDataEntryValue | null;
  }[] = [];

  res.forEach((id) => {
    reservations.push({
      group: formData.get("reservationGroup" + id),
      slots: formData.get("reservationSlots" + id),
    });
  });

  // console.log(createdBy);

  try {
    const newLoop = new Loop({
      createdBy,
      date,
      title,
      description,
      capacity,
      departureTime,
      departureLocation: departureLoc,
      pickUpTime,
      pickUpLocation: pickUpLoc ?? "",
      approxDriveTime,
      reservations,
    });

    await newLoop.save();
    revalidateTag("groups");
  } catch (error) {
    console.log(error);
    return "Error:";
  }

  return "Success";
}
