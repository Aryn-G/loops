"use server";

import { revalidateTag } from "next/cache";

export async function refreshAction(formData: FormData) {
  const tags = formData.getAll("tag");

  tags.forEach((tag) => revalidateTag(tag?.toString()));
}
