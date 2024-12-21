import { auth } from "@/auth";
import { forbidden, notFound, redirect, unauthorized } from "next/navigation";
import Refresh from "@/app/_components/Refresh";
import Link from "next/link";
import { getGroup } from "@/app/_db/queries/groups";
import EditGroupUsers from "./EditGroupUsers";
import { getFilteredUsers } from "@/app/_db/queries/users";
import ManageGroupUsers from "./ManageGroupUsers";
import EditGroup from "./EditGroup";
import { Metadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const id = (await params).id;
  const group = await getGroup(id);
  if (!group) return {};

  return {
    title: "Loops • Dashboard / Manage Student Groups / " + group.name,
  };
}
export default async function Page({ params }: Props) {
  const session = await auth();

  if (!session) return unauthorized();
  if (session.user?.role === "Student") return forbidden();
  // Beyond this point, role = "Admin"
  const id = (await params).id;
  const group = await getGroup(id);
  if (!group) return notFound();

  const allUsers = await getFilteredUsers();

  return (
    <>
      <Link
        href={"/dashboard"}
        className="inline-block lg:hidden text-sm underline underline-offset-2"
      >
        {/* <CaretRight className="size-4 rotate-180" /> */}
        Back to Dashboard
      </Link>
      <span className="lg:hidden"> / </span>
      <Link
        href={"/dashboard/manage-student-groups"}
        className="inline underline underline-offset-2 text-sm"
      >
        {/* <CaretRight className="size-4 rotate-180" /> */}
        <span className="hidden lg:inline">Back to </span>Manage Student Groups
      </Link>
      <div className="flex items-center justify-between">
        <h1 className="font-black text-xl">Editting Student Group</h1>
        <div className="flex items-center">
          <Refresh tag={"groups"} />
          {/* <Refresh path={"/dashboard/manage-student-groups/" + id} /> */}
        </div>
      </div>

      <EditGroup group={group} />

      <EditGroupUsers allUsers={allUsers} group={group} />

      <ManageGroupUsers group={group} />
    </>
  );
}
