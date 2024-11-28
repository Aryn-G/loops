import { getFilteredUsers } from "@/app/_lib/users";
import ManageAccessClient from "./ManageAccessClient";

export default async function ManageAccess() {
  const allUsers = await getFilteredUsers();

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageAccessClient allUsers={allUsers} />
    </div>
  );
}
