import { getFilteredUsers } from "@/app/_db/queries/users";
import CreateGroupClient from "./CreateGroupClient";
import { getGroups } from "@/app/_db/queries/groups";

export default async function CreateGroup() {
  // await wait(1000);
  const allGroups = await getGroups();
  const allUsers = await getFilteredUsers();

  return <CreateGroupClient allGroups={allGroups} allUsers={allUsers} />;
}
