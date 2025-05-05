import { Session } from "next-auth";
import ManageLoopsClient from "./ManageLoopsClient";
import { getLoops } from "@/app/_db/queries/loops";

export default async function ManageLoops({ session }: { session: Session }) {
  // await wait(1000);
  const allLoops = await getLoops(null, null);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageLoopsClient session={session} allLoops={allLoops} />
    </div>
  );
}
