import { getLoop } from "../_db/queries/loops";
import { LoopData } from "../_db/models/Loop";
import {
  addMinutes,
  formatDate,
  formatDuration,
  formatTime,
  subTime,
} from "@/app/_lib/time";

// type OptionalLoopData = { [P in keyof LoopData]?: LoopData[P] };
type OptionalLoopData = LoopData;
export default function LoopCard({
  data,
  expanded = false,
  capDesc = "line-clamp-6",
}: {
  data: OptionalLoopData | NonNullable<Awaited<ReturnType<typeof getLoop>>>;
  expanded?: boolean;
  capDesc?: "line-clamp-6" | "line-clamp-1";
}) {
  data.approxDriveTime ||= 0;
  data.capacity ||= 0;
  // data.filled ||= 0;

  return (
    <div
      className={
        "flex flex-col flex-1 gap-1.5 break-all " +
        (!expanded && data.deleted && "text-rose-500")
      }
    >
      <p className={expanded ? "" : "font-thin"}>
        {/*  TODO: clicking date goes to loops/?filter={date} */}
        <span>
          {data.departureDateTime
            ? formatDate(data.departureDateTime, expanded)
            : "<Date>"}
        </span>
        {!!data.loopNumber && <span> - Loop #{data.loopNumber}</span>}
      </p>
      <h3 className={"font-bold text-xl " + (data.deleted && "text-rose-500")}>
        {data.deleted && "(DELETED)"} {data.title || "<Title>"}
      </h3>
      {!expanded && (
        <p className="">
          <span>
            Available: {(data.capacity ?? 0) - (data.filled.length ?? 0)}
          </span>
          {data.reservations && data.reservations.length > 0 && (
            <span> - Contains Reservations</span>
          )}
        </p>
      )}
      <p className={expanded ? "" : capDesc + " flex-1"}>
        {data.description || "<Description>"}
      </p>
      <div className="grid grid-cols-[6rem_1fr_6rem] text-sm my-4 place-items-center text-center">
        <p className="font-thin">Departure</p>
        <p></p>
        <p className="font-thin">~ Arrival</p>
        <p className="font-bold text-base">
          {data.departureDateTime
            ? formatTime(data.departureDateTime)
            : "00:00 AM"}
        </p>
        <div className="w-full text-center relative">
          <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-current left-0"></div>
          <div className="absolute h-0.5 bg-current inset-x-0 top-1/2 -translate-y-1/2"></div>
          <span
            className={`${
              !expanded ? "bg-white" : "bg-ncssm-light-blue"
            } relative py-1 px-2.5`}
          >
            {formatDuration(data.approxDriveTime ?? 0)}
          </span>
        </div>
        <p className="font-bold text-base">
          {data.departureDateTime
            ? formatTime(
                addMinutes(data.departureDateTime, data.approxDriveTime ?? 0)
              )
            : "00:00 AM"}
        </p>
        <p className="font-thin line-clamp-2 overflow-hidden text-ellipsis">
          {data.departureLocation || "<Departure Location>"}
        </p>
        <p></p>
        <p></p>

        <div className="col-span-3 flex flex-row items-center justify-center w-full px-11 text-current -mt-6 mb-3">
          <div
            className={
              expanded ? "mt-[calc(5.25rem+1px)]" : "mt-[calc(2.25rem-1px)]"
            }
          >
            <Curve expanded={expanded} />
          </div>
          <div className="flex-1 text-center relative  z-10">
            <div
              className={`absolute h-px bg-current top-1/2 -translate-y-1/2 ${
                expanded ? "-inset-x-[3px]" : "-inset-x-px"
              }`}
            ></div>
            <span
              className={`${
                !expanded ? "bg-white" : "bg-ncssm-light-blue"
              } absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 text-nowrap py-1 px-2.5 rounded-full ring-1 ring-current`}
            >
              {data.departureDateTime !== "" && data.pickUpDateTime !== ""
                ? formatDuration(
                    subTime(
                      data.pickUpDateTime,
                      addMinutes(
                        data.departureDateTime,
                        data.approxDriveTime ?? 0
                      )
                    )
                  )
                : formatDuration(0)}
            </span>
          </div>
          <div
            className={
              expanded ? "-mt-[calc(5.25rem+1px)]" : "-mt-[calc(2.25rem-1px)]"
            }
          >
            <Curve expanded={expanded} rotate />
          </div>
        </div>

        <p className="font-thin">Pick Up</p>
        <p></p>
        <p className="font-thin">~ Return</p>
        <p className="font-bold text-base">
          {data.pickUpDateTime ? formatTime(data.pickUpDateTime) : "00:00 AM"}
        </p>
        <div className="w-full text-center relative">
          <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-current right-0"></div>
          <div className="absolute h-0.5 bg-current inset-x-0 top-1/2 -translate-y-1/2"></div>
          <span
            className={`${
              !expanded ? "bg-white" : "bg-ncssm-light-blue"
            } relative py-1 px-2.5`}
          >
            {formatDuration(data.approxDriveTime ?? 0)}
          </span>
        </div>
        <p className="font-bold text-base">
          {data.pickUpDateTime
            ? formatTime(
                addMinutes(data.pickUpDateTime, data.approxDriveTime ?? 0)
              )
            : "00:00 AM"}
        </p>
        <p className="font-thin line-clamp-2 overflow-hidden text-ellipsis">
          {data.pickUpLocation || ""}
        </p>
        <p></p>
        <p></p>
      </div>
      {/* <p>
        {expanded && "Sign-Ups "}Open{!expanded && "s"}:{" "}
        {data.signUpOpenDateTime ? (
          <>
            {formatDate(data.signUpOpenDateTime, expanded)}{" "}
            {expanded && formatTime(data.signUpOpenDateTime)}
          </>
        ) : (
          "<Sign Ups Open>"
        )}
      </p> */}
    </div>
  );
}

export function Curve({
  expanded,
  rotate = false,
}: {
  expanded: boolean;
  rotate?: boolean;
}) {
  return expanded ? (
    <svg
      viewBox="0 0 87 87"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${rotate && "rotate-180"} size-[87px]`}
    >
      <path
        d="M85 1 36 0.9C16.67 0.9 0.9 16.67 0.9 36 L1 85"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg
      viewBox="0 0 37 37"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${rotate && "rotate-180"} size-[37px]`}
    >
      <path
        d="M36 0.9C16.67 0.9 0.9 16.67 0.9 36"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
