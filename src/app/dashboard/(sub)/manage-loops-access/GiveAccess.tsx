import { getFilteredUsers } from "@/app/_db/queries/users";
import GiveAccessClient from "./GiveAccessClient";

export default async function GiveAccess() {
  // await wait(1000);
  const allUsers = await getFilteredUsers();

  return <GiveAccessClient allUsers={allUsers} />;
}
