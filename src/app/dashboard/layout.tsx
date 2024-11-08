import { redirect } from "next/navigation";
import Sidebar from "./Sidebar";
import { auth } from "@/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session) return redirect("/");
  return (
    <>
      <main className="flex-1 flex flex-col pt-20">
        <div className="w-full px-20 gap-5 justify-center flex max-w-screen-2xl mx-auto">
          <Sidebar session={session} />
          <div className="w-full flex flex-col gap-3">{children}</div>
        </div>
      </main>
    </>
  );
}
