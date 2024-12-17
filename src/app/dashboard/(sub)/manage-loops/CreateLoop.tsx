import { getFilteredUsers } from "@/app/_db/queries/users";
import CreateLoopClient from "./CreateLoopClient";
import { getGroups } from "@/app/_db/queries/groups";
import { Session } from "next-auth";

import { getLoop, getLoops } from "@/app/_db/queries/loops";
import { Params } from "@/app/_lib/types";
import { getSubscriptions } from "@/app/_db/queries/subscriptions";

export default async function CreateLoop({
  session,
  searchParams,
}: {
  session: Session;
  searchParams: Params;
}) {
  // await wait(1000);
  const allGroups = await getGroups();
  const allLoops = await getLoops();
  // const allSubs = await getSubscriptions();

  // const autofill = (await searchParams).autofill;
  // const loop =
  //   typeof autofill == "string" ? await getLoop(autofill) : undefined;

  return (
    <CreateLoopClient
      session={session}
      allGroups={allGroups}
      allLoops={allLoops}
      // allSubs={allSubs}
    />
  );
}
