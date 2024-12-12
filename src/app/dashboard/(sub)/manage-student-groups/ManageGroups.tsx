import ManageGroupsClient from "./ManageGroupsClient";
import { getGroups } from "@/app/_db/queries/groups";

export default async function ManageGroups() {
  // await wait(1000);
  const allGroups = await getGroups(null);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageGroupsClient allGroups={allGroups} />
    </div>
  );
}
