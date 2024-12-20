import { auth } from "@/auth";
import { forbidden, redirect, unauthorized } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { Suspense } from "react";
import GiveAccess from "./GiveAccess";
import ManageAccess from "./ManageAccess";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Dashboard / Manage Loops Access",
};

export default async function Page() {
  const session = await auth();

  if (!session) return unauthorized();
  if (session.user?.role !== "Admin") return forbidden();
  // Beyond this point, role = "Admin"

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
        <h1 className="font-black text-xl">Manage Loops Access</h1>
        <div className="flex items-center">
          {/* <Refresh tag={"filteredUsers"} /> */}
          <Refresh path="/dashboard/manage-loops-access" />
        </div>
      </div>
      <div className="">
        <p>Loops Access allows account to:</p>
        <ul className="list-disc list-inside">
          <li>Create Loops</li>
          <li>Edit/Delete Loops</li>
          <li>Edit/Delete All Sign-Ups</li>
        </ul>
        {/* <br /> */}
        <p>
          This would typically be given to someone like a Community Coordinator.
        </p>
        <br />
      </div>
      <p className="font-black text-xl">Give Access</p>
      <div>Only give Loops Access to accounts you trust.</div>

      <Suspense fallback={<p>Loading...</p>}>
        <GiveAccess />
      </Suspense>
      <br />
      <p className="font-black text-xl">Current Access</p>

      <Suspense fallback={<p>Loading...</p>}>
        <ManageAccess />
      </Suspense>
    </>
  );
}
