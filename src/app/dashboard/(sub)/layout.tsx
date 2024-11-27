import { redirect } from "next/navigation";
import Sidebar from "../Sidebar";
import { auth, ExtendedSession } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session: ExtendedSession | null = await auth();

  if (!session) return redirect("/");

  return (
    <div className="flex gap-5 relative">
      <Sidebar session={session} />
      <div className="w-full">{children}</div>
    </div>
  );
}
