"use server";

import { revalidatePath, revalidateTag } from "next/cache";

export async function refreshAction(formData: FormData) {
  const tags = formData.getAll("tag");
  const path = formData.get("path");

  tags.forEach((tag) => revalidateTag(tag?.toString()));

  if (path) revalidatePath(path.toString());
}
