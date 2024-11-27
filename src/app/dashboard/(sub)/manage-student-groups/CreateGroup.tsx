import { getFilteredUsers } from "@/app/_lib/users";
import CreateGroupClient from "./CreateGroupClient";
import { getGroups } from "@/app/_lib/groups";

export default async function CreateGroup() {
  const allGroups = await getGroups();
  const allUsers = await getFilteredUsers();

  return <CreateGroupClient allGroups={allGroups} allUsers={allUsers} />;
}
