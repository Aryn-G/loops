import { auth } from "@/auth";
import { redirect, unauthorized } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import mongoDB from "@/app/_db/connect";
import Sessions, { ISessions } from "@/app/_db/models/Sessions";
import { revalidateTag } from "next/cache";
// import ManageSessions from "./ManageSessions";
import { Suspense } from "react";
import ManageSignUps from "./ManageSignUps";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Dashboard / My Sign-Ups",
};

export default async function Page() {
  const session = await auth();
  if (!session) return unauthorized();

  return (
    <>
      <Link
        href={"/dashboard"}
        className="flex gap-2 items-center lg:hidden text-sm underline underline-offset-2"
      >
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">My Sign-Ups</h1>
        <div className="flex items-center">
          <Refresh tag={"signups"} />
        </div>
      </div>
      <p>This is a list of all the loops that have you have signed up for.</p>
      <Suspense fallback={<p>Loading...</p>}>
        <ManageSignUps session={session} />
      </Suspense>
    </>
  );
}
