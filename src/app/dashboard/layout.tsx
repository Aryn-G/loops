import { redirect, unauthorized } from "next/navigation";
import { auth } from "@/auth";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Dashboard",
};

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) return unauthorized();

  return <>{children}</>;
}
