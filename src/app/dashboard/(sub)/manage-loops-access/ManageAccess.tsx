import { getFilteredUsers } from "@/app/_db/queries/users";
import ManageAccessClient from "./ManageAccessClient";

export default async function ManageAccess() {
  // await wait(1000);
  const allUsers = await getFilteredUsers();

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageAccessClient allUsers={allUsers} />
    </div>
  );
}
