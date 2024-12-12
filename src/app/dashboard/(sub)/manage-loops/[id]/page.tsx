import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { getFilteredUsers } from "@/app/_db/queries/users";
import { getLoop } from "@/app/_db/queries/loops";
import EditLoopSignUps from "./EditLoopSignUps";
import ManageLoopSignUps from "./ManageLoopSignUps";
import { Fragment } from "react";
import EditLoopForm from "./EditLoopForm";
import { getGroups } from "@/app/_db/queries/groups";

import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const loop = await getLoop(id);
  if (!loop) return {};

  return {
    title: "Loops • Dashboard / Manage Loops / " + loop.title,
  };
}

export default async function Page({ params }: Props) {
  const session = await auth();

  if (!session) return redirect("/");
  if (session.user?.role === "Student") redirect("/dashboard");
  // Beyond this point, role = "Admin"
  const id = (await params).id;
  const loop = await getLoop(id);
  if (!loop) return redirect("/dashboard/manage-loops");
  const allUsers = await getFilteredUsers();
  const allGroups = await getGroups();

  return (
    <>
      <div className="">
        <Link
          href={"/dashboard"}
          className="inline lg:hidden text-sm underline underline-offset-2"
        >
          {/* <CaretRight className="size-4 rotate-180" /> */}
          Back to Dashboard
        </Link>
        <span className="lg:hidden"> / </span>
        <Link
          href={"/dashboard/manage-loops"}
          className="inline underline underline-offset-2 text-sm"
        >
          {/* <CaretRight className="size-4 rotate-180" /> */}
          <span className="hidden lg:inline">Back to </span>Manage Loops
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Editting Loop: {loop._id}</h1>
        <div className="flex items-center">
          <Refresh tag={"loopsTag"} />
        </div>
      </div>

      {/* <LoopCard data={loop} expanded /> */}

      <EditLoopForm loop={loop} allGroups={allGroups} session={session} />
      <br />
      <p className="font-black text-xl">
        Sign Ups: {loop.filled.length} / {loop.capacity}
      </p>
      <div className="w-fit grid grid-cols-[repeat(4,auto)] gap-x-2">
        {loop.reservations.map((res) => (
          <Fragment key={res.group._id}>
            <span className="text-center">
              {
                loop.filled.filter(
                  (f) => f.group && f.group._id == res.group._id
                ).length
              }
            </span>
            <span> / </span>
            <span className="text-center">{res.slots}</span>
            <span className="ml-2">{res.group.name}</span>
          </Fragment>
        ))}
        <span className="text-center">
          {loop.filled.filter((f) => f.group === undefined).length}
        </span>
        <span> / </span>
        <span className="text-center">
          {loop.capacity -
            loop.reservations
              .map((r) => r.slots)
              .reduce((sum, r) => sum + r, 0)}
        </span>
      </div>
      <EditLoopSignUps loop={loop} allUsers={allUsers} />
      <ManageLoopSignUps loop={loop} />
    </>
  );
}
