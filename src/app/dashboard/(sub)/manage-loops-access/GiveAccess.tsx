import { getFilteredUsers } from "@/app/_lib/users";
import GiveAccessClient from "./GiveAccessClient";

export default async function GiveAccess() {
  const allUsers = await getFilteredUsers();

  return <GiveAccessClient allUsers={allUsers} />;
}
