import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { Suspense } from "react";
import CreateGroup from "./CreateGroup";
import ManageGroups from "./ManageGroups";

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/");
  if (session.user?.role !== "Admin") redirect("/dashboard");
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
        <h1 className="font-black text-xl">Manage Student Groups</h1>
        <div className="flex items-center">
          <Refresh tag={"groups"} />
          {/* <Refresh path={"/dashboard/manage-student-groups"} /> */}
        </div>
      </div>
      <div className="">
        <p>
          You might create Student Groups for the something like the following:
        </p>
        <ul className="list-disc list-inside">
          <li>A residence hall</li>
          <li>A club</li>
          <li>A sports team</li>
        </ul>
        <p>Student groups are useful to create reserved loops.</p>
        <p>Example: 4th South Golf Loop</p>
        <p>Example: 3rd South Olive Garden Loop</p>
      </div>
      <br />
      <p className="font-black text-xl">Create a Group</p>
      <Suspense>
        <CreateGroup />
      </Suspense>
      <br />
      <p className="font-black text-xl">Manage Groups</p>
      <Suspense>
        <ManageGroups />
      </Suspense>
    </>
  );
}
