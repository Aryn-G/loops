import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import mongoDB from "@/app/_mongo/connect";
import Sessions, { ISessions } from "@/app/_mongo/models/Sessions";
import { revalidateTag } from "next/cache";
import ManageSessions from "./ManageSessions";

export default async function Page() {
  const session = await auth();
  if (!session) return redirect("/");

  return (
    <>
      <Link
        href={"/dashboard"}
        className="flex gap-2 items-center lg:hidden text-sm underline underline-offset-2"
      >
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Sessions</h1>
        <div className="flex items-center">
          <Refresh tag={"sessions"} />
        </div>
      </div>
      <ManageSessions session={session} />
    </>
  );
}
