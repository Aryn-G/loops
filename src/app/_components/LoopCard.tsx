import { LoopData } from "../_mongo/models/Loop";

function formatTime(time: string) {
  const [hours, minutes] = time.split(":");
  if (parseInt(hours) > 12)
    return `${parseInt(hours) - 12}:${minutes.padStart(2, "0")} PM`;
  else if (parseInt(hours) == 0)
    return `${parseInt(hours) + 12}:${minutes.padStart(2, "0")} AM`;
  else return `${parseInt(hours)}:${minutes.padStart(2, "0")} AM`;
}

function addMinutes(time: string, addMins: number) {
  const [hours, minutes] = time.split(":");
  addMins = parseInt(minutes) + addMins;

  const parsedHours = (parseInt(hours) + Math.floor(addMins / 60)) % 24;
  addMins %= 60;

  return `${parsedHours}:${addMins}`;
}

function subTime(smaller: string, larger: string) {
  const [h1, m1] = smaller.split(":");
  const [h2, m2] = larger.split(":");
  const t =
    parseInt(h2) * 60 + parseInt(m2) - (parseInt(h1) * 60 + parseInt(m1));

  return t;
}

function formatDuration(mins: number) {
  const hours = Math.floor(mins / 60);
  mins %= 60;
  if (hours > 0) return `${hours}H ${mins}M`;
  else return `${mins}M`;
}

type OptionalLoopData = { [P in keyof LoopData]?: LoopData[P] };
export default function LoopCard({
  data,
  expanded = false,
}: {
  data: OptionalLoopData;
  expanded?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="font-thin">
        <span>
          {data.date
            ? data.date.toLocaleDateString("en-US", {
                weekday: expanded ? "long" : "short",
                month: expanded ? "long" : "short",
                day: "numeric",
                year: expanded ? "numeric" : undefined,
              })
            : "<Date>"}
        </span>
        <span> - </span>
        {/* <span>{data.loopNumber ?? "Loop #"}</span> */}
        <span>Loop #</span>
      </p>
      <h3 className="font-bold text-xl">{data.title ?? "<Title>"}</h3>
      {!expanded && (
        <p className="">
          <span>
            Available: {(data.capacity ?? 0) - (data.filled?.length ?? 0)}
          </span>
          {data.reservations && data.reservations.length > 0 && (
            <span> - Contains Reservations</span>
          )}
        </p>
      )}
      <p>{data.description ?? "<Description>"}</p>
      <div className="grid grid-cols-[6rem_1fr_6rem] text-sm my-4 place-items-center text-center">
        <p className="font-thin">Departure</p>
        <p></p>
        <p className="font-thin">~ Arrival</p>
        <p className="font-bold text-base">
          {data.departureTime ? formatTime(data.departureTime) : "00:00 AM"}
        </p>
        <div className="w-full text-center relative">
          <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-black left-0"></div>
          <div className="absolute h-0.5 bg-black inset-x-0 top-1/2 -translate-y-1/2"></div>
          <span className={`${!expanded && "bg-white"} relative py-1 px-2.5`}>
            {formatDuration(data.approxDriveTime ?? 0)}
          </span>
        </div>
        <p className="font-bold text-base">
          {data.departureTime
            ? formatTime(
                addMinutes(data.departureTime, data.approxDriveTime ?? 0)
              )
            : "00:00 AM"}
        </p>
        <p className="font-thin line-clamp-2 overflow-hidden text-ellipsis">
          {data.departureLocation ?? "<Departure Location>"}
        </p>
        <p></p>
        <p></p>

        <div className="col-span-3 flex flex-row items-center justify-center w-full px-11 text-neutral-500 -mt-6 mb-3">
          <div className="mt-[calc(2.25rem-1px)]">
            <svg
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M36 1V1C16.67 1 1 16.67 1 36V36"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="flex-1 text-center relative">
            <div className="absolute h-px bg-current -inset-x-px top-1/2 -translate-y-1/2"></div>
            <span
              className={`${
                !expanded && "bg-white"
              } relative py-1 px-2.5 rounded-full ring-1 ring-neutral-500 text-black`}
            >
              {formatDuration(
                subTime(
                  addMinutes(
                    data.departureTime ?? "0:00",
                    data.approxDriveTime ?? 0
                  ),
                  data.pickUpTime ?? "0:00"
                )
              )}
            </span>
          </div>
          <div className="-mt-[calc(2.25rem-1px)]">
            <svg
              width="37"
              height="37"
              viewBox="0 0 37 37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="rotate-180"
            >
              <path
                d="M36 1V1C16.67 1 1 16.67 1 36V36"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        <p className="font-thin">Pick Up</p>
        <p></p>
        <p className="font-thin">~ Return</p>
        <p className="font-bold text-base">
          {data.pickUpTime ? formatTime(data.pickUpTime) : "00:00 AM"}
        </p>
        <div className="w-full text-center relative">
          <div className="absolute top-1/2 -translate-y-1/2 size-3 rounded-full bg-black right-0"></div>
          <div className="absolute h-0.5 bg-black inset-x-0 top-1/2 -translate-y-1/2"></div>
          <span className={`${!expanded && "bg-white"} relative py-1 px-2.5`}>
            {formatDuration(data.approxDriveTime ?? 0)}
          </span>
        </div>
        <p className="font-bold text-base">
          {data.pickUpTime
            ? formatTime(addMinutes(data.pickUpTime, data.approxDriveTime ?? 0))
            : "00:00 AM"}
        </p>
        <p className="font-thin line-clamp-2 overflow-hidden text-ellipsis">
          {data.pickUpLocation ?? ""}
        </p>
        <p></p>
        <p></p>
      </div>
    </div>
  );
}
