import { getUserSessions } from "@/app/_db/queries/sessions";
import { Session } from "next-auth";

import { getUserSignUps } from "@/app/_db/queries/signups";
import ManageSignUpsClient from "./ManageSignUpsClient";

export default async function ManageSignUps({ session }: { session: Session }) {
  // await wait(1000);
  const userSignUps = await getUserSignUps(session.userId);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageSignUpsClient userSignUps={userSignUps} />
    </div>
  );
}
