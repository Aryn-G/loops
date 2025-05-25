import { auth } from "@/auth";
import { forbidden, redirect, unauthorized } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import mongoDB from "@/app/_db/connect";
import Sessions, { ISessions } from "@/app/_db/models/Sessions";
import { revalidateTag } from "next/cache";
import { Suspense } from "react";

import { Metadata } from "next";
import { getFilteredUsers } from "@/app/_db/queries/users";
import CreateAccountsClient from "./CreateAccountsClient";
import ManageAccountsClient from "./ManageAccountsClient";

export const metadata: Metadata = {
  title: "Loops • Dashboard / Manage Accounts",
};

export default async function Page() {
  const session = await auth();
  if (!session) return unauthorized();
  if (session.user?.role !== "Admin") return forbidden();

  const allUsers = await getFilteredUsers(null);

  return (
    <>
      <Link
        href={"/dashboard"}
        className="flex gap-2 items-center lg:hidden text-sm underline underline-offset-2"
      >
        Back to Dashboard
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Manage Accounts</h1>
        <div className="flex items-center">
          <Refresh tag={"appearance"} />
        </div>
      </div>
      <p>
        Quickly manage all the accounts that have access to the Loops System.
      </p>
      {/* <Suspense fallback={<p>Loading...</p>}></Suspense> */}
      <CreateAccountsClient allUsers={allUsers} />
      <p className="font-black text-xl">Current Accounts</p>
      <ManageAccountsClient session={session} allUsers={allUsers} />
    </>
  );
}
