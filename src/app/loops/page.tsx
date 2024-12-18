import { auth } from "@/auth";
import { redirect, unauthorized } from "next/navigation";
import SearchLoops from "./SearchLoops";
import { getLoops } from "../_db/queries/loops";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Loops • Browse",
};

export default async function Page() {
  const session = await auth();
  if (!session) return unauthorized();

  return (
    <div className="pt-20">
      <h1 className="text-center font-black text-xl md:text-3xl">
        NCSSM-Morganton Loops
      </h1>
      <SearchLoops allLoops={await getLoops()} />
    </div>
  );
}
