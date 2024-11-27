import { auth, ExtendedSession } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { Suspense } from "react";
import ManageAccess from "./ManageAccess";
import Search from "@/app/_icons/Search";
import GiveAccess from "./GiveAccess";
import UserPlus from "@/app/_icons/UserPlus";

export default async function Dashbaord({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const session: ExtendedSession | null = await auth();
  if (!session) return redirect("/");
  if (session.user?.role !== "Admin") redirect("/dashboard/profile");
  // Beyond this point, role = "Loops" or "Admin"

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
          <Refresh tag={"filteredUsers"} />
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
      {/* <br /> */}
      {/* <div className="flex flex-row-reverse"> */}

      {/* </div> */}
      <Suspense>
        <GiveAccess />
      </Suspense>
      <br />
      <p className="font-black text-xl">Current Access</p>

      <Suspense>
        <ManageAccess />
      </Suspense>
    </>
  );
}
