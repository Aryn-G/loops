import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { Suspense } from "react";
import CreateForm from "./CreateLoop";

export default async function Page() {
  const session = await auth();

  if (!session) return redirect("/");
  if (session.user?.role === "Student") redirect("/dashboard");
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
          <Refresh tag={"loops"} />
        </div>
      </div>
      <div className="max-w-md">
        <p>Loops are </p>
        <p>You might create Loops for the something like the following:</p>
        <ul className="list-disc list-inside">
          <li>Morganton Heights Shopping Center</li>
          <li>Cook Out / Chic-fil-a</li>
          <li>Edit/Delete All Sign-Ups</li>
        </ul>
      </div>
      <br />
      <p className="font-black text-xl">Create a Loop</p>
      <Suspense>
        <CreateForm session={session} />
      </Suspense>
      <br />
      <p className="font-black text-xl">Edit Loops</p>
    </>
  );
}
