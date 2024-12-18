import { redirect, unauthorized } from "next/navigation";
import Sidebar from "../Sidebar";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session) return unauthorized();

  return (
    <div className="flex gap-5 relative">
      <Sidebar session={session} />
      <div className="w-full @container/sub">{children}</div>
    </div>
  );
}
