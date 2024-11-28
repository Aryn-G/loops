import { getUserSessions } from "@/app/_lib/sessions";
import ManageSessionsClient from "./ManageSessionsClient";
import { Session } from "next-auth";

export default async function ManageSessions({
  session,
}: {
  session: Session;
}) {
  const userSessions = await getUserSessions(session.userId);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageSessionsClient userSessions={userSessions} session={session} />
    </div>
  );
}
