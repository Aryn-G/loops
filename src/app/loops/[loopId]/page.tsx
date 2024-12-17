import LoopCard from "@/app/_components/LoopCard";
import { getLoop } from "@/app/_db/queries/loops";
import { auth } from "@/auth";
import { notFound, redirect, unauthorized } from "next/navigation";
import SignUpInfo from "./SignUpInfo";
import SignUpButton from "./SignUpButton";
import Refresh from "@/app/_components/Refresh";

import { Metadata } from "next";
import { ImageResponse } from "next/og";

type Props = {
  params: Promise<{ loopId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const loopId = (await params).loopId;
  const loop = await getLoop(loopId);
  if (!loop) return {};

  return {
    title: "Loops • " + loop.title,
    // in future generate custom OG image
    // openGraph: {
    //   images: [new ImageResponse((<div style={}></div>), {width: 1200, height: 600})]
    // }
  };
}

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
          <Refresh tag="loopsTag" />
        </div>
        <SignUpInfo loop={loop} session={session} />
      </div>
    </div>
  );
}
