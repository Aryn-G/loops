"use server";

import mongoDB from "@/app/_db/connect";

import { auth } from "@/auth";
import Users from "@/app/_db/models/Users";

import { revalidatePath } from "next/cache";

export async function saveAppearance(prevState: any, formData: FormData) {
  await mongoDB();

  const appearance = formData.get("appearance");
  try {
    if (!appearance) return "Invalid Form Submission";

    const session = await auth();
    if (!session) return "User is not Authenticated";

    await Users.findByIdAndUpdate(session.userId, { $set: { appearance } });

    revalidatePath("/dashboard/appearance");
  } catch (error) {
    console.log("Internal Error");
    return "Internal Error";
  }

  return "Success";
}
