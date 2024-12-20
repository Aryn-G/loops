import LoopCard from "@/app/_components/LoopCard";
import { getLoop } from "@/app/_db/queries/loops";
import { auth } from "@/auth";
import { notFound, redirect, unauthorized } from "next/navigation";
import SignUpInfo from "./SignUpInfo";
import SignUpButton from "./SignUpButton";
import Refresh from "@/app/_components/Refresh";

import { Metadata } from "next";
import { formatDate } from "@/app/_lib/time";
import title from "title";

type Props = {
  params: Promise<{ loopId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loopId = (await params).loopId;
  const loop = await getLoop(loopId);
  if (!loop) return {};

  return {
    title: "Loops • " + loop.title,
    description: title(
      (loop.loopNumber ? "Loop #" + loop.loopNumber + " " : "") +
        "On " +
        formatDate(loop.departureDateTime)
    ),
  };
}

/*

<meta name="description" content="User · Aryan G">

<!-- Facebook Meta Tags -->
<meta property="og:url" content="https://open.spotify.com/user/31mqlgyaj3b45vckllbllk4ctqiu">
<meta property="og:type" content="website">
<meta property="og:title" content="Aryan G">
<meta property="og:description" content="User · Aryan G">
<meta property="og:image" content="https://i.scdn.co/image/ab6775700000ee85e4de94cc70350e3982e6d37e">

<!-- Twitter Meta Tags -->
<meta name="twitter:card" content="summary_large_image">
<meta property="twitter:domain" content="open.spotify.com">
<meta property="twitter:url" content="https://open.spotify.com/user/31mqlgyaj3b45vckllbllk4ctqiu">
<meta name="twitter:title" content="Aryan G">
<meta name="twitter:description" content="User · Aryan G">
<meta name="twitter:image" content="https://i.scdn.co/image/ab6775700000ee85e4de94cc70350e3982e6d37e">

<!-- Meta Tags Generated via https://www.opengraph.xyz -->

*/

export default async function Page({ params }: Props) {
  const session = await auth();
  if (!session) return unauthorized();

  const loopId = (await params).loopId;

  const loop = await getLoop(loopId);
  if (!loop) return notFound();

  return (
    <div className="relative mt-10 flex flex-col lg:flex-row gap-10 justify-center">
      <div className="flex-1 lg:max-w-lg h-fit lg:sticky lg:top-20">
        <LoopCard data={loop} expanded />
        <SignUpButton loop={loop} session={session} />
      </div>
      <div className="flex-1 lg:max-w-lg">
        <div className="flex justify-between items-center">
          <p className="font-black text-xl flex-1">
            Sign Ups: {loop.filled.length} / {loop.capacity}
          </p>
          {/* <Refresh tag="loopsTag" /> */}
          <Refresh path={"/loops/" + loopId} />
        </div>
        <SignUpInfo loop={loop} session={session} />
      </div>
    </div>
  );
}
