import { getFilteredUsers } from "@/app/_lib/users";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import GiveAccess from "./GiveAccess";
import Refresh from "@/app/_components/Refresh";
import ManageAccess from "./ManageAccess";

export default async function Dashbaord() {
  const session = await auth();
  if (!session) return redirect("/");
  // @ts-ignore
  if (session.user.role !== "Admin") redirect("/dashboard/profile");
  // Beyond this point, role = "Loops" or "Admin"

  const allUsers = await getFilteredUsers();

  return (
    <div>
      <div className="max-w-md">
        <h1 className="font-black text-xl">Manage Loops Access</h1>
        <p>Loops Access allows account to:</p>
        <ul className="list-disc list-inside">
          <li>Create Loops</li>
          <li>Edit/Delete Loops</li>
          <li>Edit/Delete All Sign-Ups</li>
        </ul>
      </div>
      <br />
      {/* <div className="flex flex-row-reverse"> */}
      <Refresh tag={"filteredUsers"} />
      {/* </div> */}
      <GiveAccess allUsers={allUsers} />
      <br />
      <p className="font-black text-xl">Manage Current Loops Access</p>
      <ManageAccess allUsers={allUsers} />
    </div>
  );
}
