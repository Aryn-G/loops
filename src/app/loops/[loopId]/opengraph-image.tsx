import { getLoop } from "@/app/_db/queries/loops";
import {
  addMinutes,
  formatDate,
  formatDuration,
  formatTime,
  subTime,
  toISOStringOffset,
} from "@/app/_lib/time";
import { ImageResponse } from "next/og";
import { join } from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import http from "node:http";
import https from "node:https";

// export const runtime = "edge";

export const alt = "Loop Information";
export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: { loopId: string };
}) {
  // TECHNICALLY INCORRECT
  // ALL DATES ARE LOCAL TO SERVER

  const loopId = params.loopId;
  const loop = await getLoop(loopId);
  if (!loop) return null;

  const grot = async (url: string) => {
    // const grotData = await readFile(join(process.cwd(), "public", url));
    // const grotData = await readFile(
    //   join(fileURLToPath(import.meta.url), "../../../../../public", url)
    // );
    // return Uint8Array.from(grotData).buffer;

    // return await (await fetch(new URL(url, import.meta.url))).arrayBuffer();
    return new Promise((resolve, reject) => {
      (process.env.AUTH_URL?.startsWith("https") ? https : http)
        .get(`${process.env.AUTH_URL}/${url.slice(2)}`, (res) => {
          const chunks: any[] = [];
          res.on("data", (c) => chunks.push(c));
          res.on("end", () => resolve(Buffer.concat(chunks)));
        })
        .on("error", (err) => reject(err));
      // @ts-ignore
    }) as unknown as Buffer<ArrayBufferLike>;
  };

  console.log("gen");
  return new ImageResponse(
    (
      <div tw="w-full h-full flex bg-[#99CAEA] items-center justify-center px-20">
        <div tw="h-full w-full flex" style={{ transform: "scale(1)" }}>
          <div tw="text-2xl h-full flex-1 flex flex-col justify-center">
            <span tw="flex">
              {loop.departureDateTime
                ? formatDate(toISOStringOffset(loop.departureDateTime), false)
                : "<Date>"}
              {!!loop.loopNumber && ` - Loop #${loop.loopNumber}`}
            </span>
            <span tw="font-bold text-4xl my-4">{loop.title ?? "Title"}</span>
            <span tw="flex">
              {loop.capacity - loop.filled.length} Spots Avaiable{" "}
              {loop.reservations.length > 0 ? "(Some Reserved)" : ""}
            </span>
            <p>loops.ncssm.edu</p>
          </div>
          <div tw="flex mx-auto w-150">
            <div tw="w-full flex flex-col text-xl items-center justify-center text-center">
              <div tw="flex w-full">
                <span tw="font-thin w-36 flex items-center justify-center">
                  Departure
                </span>
                <span tw="flex-1"></span>
                <span tw="font-thin w-36 flex items-center justify-center">
                  ~ Arrival
                </span>
              </div>
              <div tw="flex w-full">
                <span tw="w-36 flex items-center justify-center font-bold text-2xl">
                  {loop.departureDateTime
                    ? formatTime(toISOStringOffset(loop.departureDateTime))
                    : "00:00 AM"}
                </span>
                <div tw="flex flex-col flex-1 items-center justify-center relative">
                  <div
                    style={{
                      position: "absolute",
                      width: "1.5rem",
                      height: "1.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: 0,
                      background: "currentColor",
                      borderRadius: "999",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      height: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: 0,
                      background: "currentColor",
                      right: 0,
                    }}
                  ></div>
                  <span tw={`bg-[#99CAEA] relative py-1 px-5 text-2xl`}>
                    {formatDuration(loop.approxDriveTime ?? 0)}
                  </span>
                </div>
                <span tw="w-36 flex items-center justify-center font-bold text-2xl">
                  {loop.departureDateTime
                    ? formatTime(
                        addMinutes(
                          toISOStringOffset(loop.departureDateTime),
                          loop.approxDriveTime ?? 0
                        )
                      )
                    : "00:00 AM"}
                </span>
              </div>
              <div tw="flex w-full">
                <span tw="w-36 font-thin flex items-center justify-center">
                  {loop.departureLocation || "<Departure Location>"}
                </span>
                <span tw="flex-1"></span>
                <span tw="w-36"></span>
              </div>

              <div tw="flex items-center justify-center w-full px-17 text-current -mt-6 mb-3">
                <div
                  style={{
                    display: "flex",
                    marginTop: "5.3125rem",
                  }}
                >
                  <svg
                    viewBox="0 0 87 87"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: `rotate(0deg)`,
                      width: "87px",
                      height: "87px",
                    }}
                  >
                    <path
                      d="M85 1 36 0.9C16.67 0.9 0.9 16.67 0.9 36 L1 85"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
                <div tw="flex flex-grow h-full relative">
                  <div
                    style={{
                      position: "absolute",
                      height: 2,
                      background: "currentColor",
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: -3,
                      left: -3,
                    }}
                  ></div>
                  <span
                    style={{
                      background: "#99caea",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      borderRadius: 999,
                      padding: "0.5rem 1.25rem",
                      boxShadow: "0 0 0 2 currentColor;",
                    }}
                    tw="text-2xl"
                  >
                    {formatDuration(
                      subTime(
                        toISOStringOffset(loop.pickUpDateTime),
                        addMinutes(
                          toISOStringOffset(loop.departureDateTime),
                          loop.approxDriveTime ?? 0
                        )
                      )
                    )}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    marginTop: "-5.3125rem",
                  }}
                >
                  <svg
                    viewBox="0 0 87 87"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    style={{
                      transform: `rotate(180deg)`,
                      width: "87px",
                      height: "87px",
                    }}
                  >
                    <path
                      d="M85 1 36 0.9C16.67 0.9 0.9 16.67 0.9 36 L1 85"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </div>
              </div>
              <div tw="flex w-full">
                <span tw="font-thin w-36 flex items-center justify-center">
                  Pick Up
                </span>
                <span tw="flex-1"></span>
                <span tw="font-thin w-36 flex items-center justify-center">
                  ~ Return
                </span>
              </div>

              <div tw="flex w-full">
                <span tw="w-36 flex items-center justify-center font-bold text-2xl">
                  {loop.pickUpDateTime
                    ? formatTime(toISOStringOffset(loop.pickUpDateTime))
                    : "00:00 AM"}
                </span>
                <div tw="flex flex-col flex-1 items-center justify-center relative">
                  <div
                    style={{
                      position: "absolute",
                      width: "1.5rem",
                      height: "1.5rem",
                      top: "50%",
                      transform: "translateY(-50%)",
                      right: 0,
                      background: "currentColor",
                      borderRadius: "999",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      height: 4,
                      top: "50%",
                      transform: "translateY(-50%)",
                      left: 0,
                      background: "currentColor",
                      right: 0,
                    }}
                  ></div>
                  <span tw={`bg-[#99CAEA] relative py-1 px-5 text-2xl`}>
                    {formatDuration(loop.approxDriveTime ?? 0)}
                  </span>
                </div>
                <span tw="w-36 flex items-center justify-center font-bold text-2xl">
                  {loop.pickUpDateTime
                    ? formatTime(
                        addMinutes(
                          toISOStringOffset(loop.pickUpDateTime),
                          loop.approxDriveTime ?? 0
                        )
                      )
                    : "00:00 AM"}
                </span>
              </div>

              <div tw="flex w-full">
                <span tw="w-36 font-thin flex items-center justify-center">
                  {loop.pickUpLocation ?? ""}
                </span>
                <span tw="flex-1"></span>
                <span tw="w-36"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        {
          name: "grot",
          data: await grot("./BricolageGrotesque_24pt-Regular.ttf"),
          style: "normal",
          weight: 400,
        },
        {
          name: "grot",
          data: await grot("./BricolageGrotesque_36pt-Bold.ttf"),
          style: "normal",
          weight: 700,
        },
      ],
    }
  );
}
