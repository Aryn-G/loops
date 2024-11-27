import { getFilteredUsers } from "@/app/_lib/users";
import CreateLoopClient from "./CreateLoopClient";
import { ExtendedSession } from "@/auth";
import { getGroups } from "@/app/_lib/groups";

export default async function CreateLoop({
  session,
}: {
  session: ExtendedSession;
}) {
  const allGroups = await getGroups();

  return <CreateLoopClient session={session} allGroups={allGroups} />;
}
