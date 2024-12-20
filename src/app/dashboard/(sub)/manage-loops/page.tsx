import { auth } from "@/auth";
import { forbidden, redirect, unauthorized } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { Suspense } from "react";
import CreateForm from "./CreateLoop";
import ManageLoops from "./ManageLoops";

import { Metadata } from "next";
import { Params } from "@/app/_lib/types";

export const metadata: Metadata = {
  title: "Loops • Dashboard / Manage Loops",
};

export default async function Page({ searchParams }: { searchParams: Params }) {
  const session = await auth();

  if (!session) return unauthorized();
  if (session.user?.role === "Student") return forbidden();
  // Beyond this point, role = "Loops" || "Admin"

  return (
    <>
      <Link
        href={"/dashboard"}
        className="flex gap-2 items-center lg:hidden text-sm underline underline-offset-2"
      >
        {/* <CaretRight className="size-4 rotate-180" /> */}
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Manage Loops</h1>
        <div className="flex items-center">
          {/* <Refresh tag={["loopsTag", "groups"]} /> */}
          <Refresh path="/dashboard/manage-loops" />
        </div>
      </div>
      <div className="max-w-md">
        <p>You might create Loops for the something like the following:</p>
        <ul className="list-disc list-inside">
          <li>Morganton Heights Shopping Center</li>
          <li>Cook Out / Chic-fil-a</li>
          <li>A Robotics Competition</li>
        </ul>
        {/* <p></p> */}
      </div>
      <br />
      <p className="font-black text-xl">Create a Loop</p>
      <Suspense fallback={<p>Loading...</p>}>
        <CreateForm session={session} searchParams={searchParams} />
      </Suspense>
      <br />
      <p className="font-black text-xl">Edit Loops</p>
      <Suspense fallback={<p>Loading...</p>}>
        <ManageLoops />
      </Suspense>
    </>
  );
}
