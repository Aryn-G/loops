import { Session } from "next-auth";

import NotifsClient from "./NotifsClient";
import { getUserSubscriptions } from "@/app/_db/queries/subscriptions";

export default async function Notifs({ session }: { session: Session }) {
  const userSubs = await getUserSubscriptions(session.userId);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <NotifsClient userSubs={userSubs} session={session} />
    </div>
  );
}
