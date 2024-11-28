import { auth } from "@/auth";
import Image from "next/image";
import Sidebar from "./Sidebar";
import { redirect } from "next/navigation";

export default async function Page() {
  const session = await auth();
  if (!session) return redirect("/");

  return (
    <div className="w-full flex flex-col items-center justify-center">
      {session.user?.picture ? (
        <Image
          src={session.user.picture}
          alt="profile pic"
          className="brutal-xl p-0"
          width={96}
          height={96}
          unoptimized
          referrerPolicy="no-referrer"
        />
      ) : (
        <div className="brutal-xl size-24 flex items-center justify-center">
          {session.user?.name?.at(0)}
        </div>
      )}

      <p className="text-xl font-black mt-5">{session.user?.name}</p>
      <p className="font-thin">{session.user?.email}</p>
      <p className="font-thin ring-1 rounded-lg px-3 py-0.5 ring-black my-5">
        {session.user?.role} Account
      </p>
      <Sidebar session={session} noBorder showOnMobile />
    </div>
  );
}
