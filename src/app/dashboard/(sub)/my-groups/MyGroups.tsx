import { Session } from "next-auth";

import MyGroupsClient from "./MyGroupsClient";
import { getUserGroups } from "@/app/_db/queries/groups";

export default async function MyGroups({ session }: { session: Session }) {
  const userGroups = await getUserGroups(session.userId);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <MyGroupsClient userGroups={userGroups} />
    </div>
  );
}
