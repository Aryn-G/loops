import ManageLoopsClient from "./ManageLoopsClient";
import { getLoops } from "@/app/_db/queries/loops";

export default async function ManageLoops() {
  // await wait(1000);
  const allLoops = await getLoops(null);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <ManageLoopsClient allLoops={allLoops} />
    </div>
  );
}
