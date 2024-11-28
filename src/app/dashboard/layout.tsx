import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) return redirect("/");

  return <>{children}</>;
}
