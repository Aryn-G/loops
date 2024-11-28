import { getFilteredUsers } from "@/app/_lib/users";
import CreateLoopClient from "./CreateLoopClient";
import { getGroups } from "@/app/_lib/groups";
import { Session } from "next-auth";

export default async function CreateLoop({ session }: { session: Session }) {
  const allGroups = await getGroups();

  return <CreateLoopClient session={session} allGroups={allGroups} />;
}
