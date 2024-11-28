"use server";

import mongoDB from "@/app/_mongo/connect";
import Sessions from "@/app/_mongo/models/Sessions";
import { revalidateTag } from "next/cache";

export async function removeSession(prevState: any, formData: FormData) {
  await mongoDB();

  const remove = formData.get("remove");
  //   console.log(selected);
  try {
    await Sessions.deleteOne({ _id: remove });
    revalidateTag("sessions");
  } catch (error) {
    return error;
  }

  return "Success";
}
