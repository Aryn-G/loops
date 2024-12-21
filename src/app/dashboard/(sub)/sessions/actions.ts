"use server";

import mongoDB from "@/app/_db/connect";
import Sessions from "@/app/_db/models/Sessions";
import { revalidateTag } from "next/cache";

export async function removeSession(prevState: any, formData: FormData) {
  await mongoDB();

  const remove = formData.getAll("remove");
  //   console.log(selected);
  try {
    if (!remove) return "Invalid Form Submission";
    await Sessions.deleteMany({ _id: { $in: remove } });
    revalidateTag("sessions");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}
