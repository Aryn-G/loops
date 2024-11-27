import ManageGroupsClient from "./ManageGroupsClient";
import { getGroups } from "@/app/_lib/groups";

export default async function ManageGroups() {
  const allGroups = await getGroups();

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageGroupsClient allGroups={allGroups} />
    </div>
  );
}
