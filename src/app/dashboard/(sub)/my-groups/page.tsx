import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import mongoDB from "@/app/_db/connect";
import Sessions, { ISessions } from "@/app/_db/models/Sessions";
import { revalidateTag } from "next/cache";
// import ManageSessions from "./ManageSessions";
import { Suspense } from "react";
import MyGroups from "./MyGroups";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Dashboard / My Groups",
};

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
        <h1 className="font-black text-xl">My Groups</h1>
        <div className="flex items-center">
          <Refresh tag={"groups"} />
        </div>
      </div>
      <p>This is a list of all the student groups you are a part of.</p>
      <Suspense fallback={<p>Loading...</p>}>
        <MyGroups session={session} />
      </Suspense>
    </>
  );
}
