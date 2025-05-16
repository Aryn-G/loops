"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { deleteLoop, editLoopAction } from "./actions";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "@/app/_components/LoopCard";

import {
  AdjustmentsHorizontalIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";

import { getGroups } from "@/app/_db/queries/groups";
import { Session } from "next-auth";
import TextArea from "@/app/_components/Inputs/TextArea";
import { addMinutes, toISOStringOffset } from "@/app/_lib/time";
import { getLoop } from "@/app/_db/queries/loops";

import { removeLoop } from "../actions";

type Props = {
  session: Session;
  allGroups: Awaited<ReturnType<typeof getGroups>>;
  loop: NonNullable<Awaited<ReturnType<typeof getLoop>>>;
};

type Reservation = { slots?: number; group?: string; id: string };

let count = 0;
function genID() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

const EditLoopForm = ({ session, allGroups, loop }: Props) => {
  const [_state, action, pending] = useActionState(editLoopAction, {});

  const [loopNumber, setLoopNumber] = useState<number>(loop.loopNumber ?? NaN);
  const [reservations, setReservations] = useState<Reservation[]>(
    loop.reservations
      ? loop.reservations.map((r, i) => ({
          group: r.group._id,
          slots: r.slots,
          id: r.group._id,
        }))
      : []
  );

  const [title, setTitle] = useState<string>(loop.title);
  const [description, setDescription] = useState<string>(loop.description);
  const [approxDriveTime, setApproxDriveTime] = useState<number>(
    loop.approxDriveTime
  );
  const [capacity, setCapacity] = useState<number>(loop.capacity);
  const [departureLocation, setDepartureLocation] = useState<string>(
    loop.departureLocation
  );
  const [departureDateTime, setDepartureDateTime] = useState<string>(
    toISOStringOffset(loop.departureDateTime)
  );

  const [pickUpLocation, setPickUpLocation] = useState<string>(
    loop.pickUpLocation ?? ""
  );
  const [pickUpDateTime, setPickUpDateTime] = useState<string>(
    toISOStringOffset(loop.pickUpDateTime)
  );

  const [signUpOpenDateTime, setSignUpOpenDateTime] = useState<string>(
    toISOStringOffset(loop.signUpOpenDateTime)
  );
  useEffect(() => {
    if (!pending) {
      setReservations((r) => [...r]);
    }
  }, [pending]);

  const addReservation = () => {
    if (reservations.length < Math.min(allGroups.length, capacity)) {
      setReservations((r) => [...r, { group: "", slots: 1, id: genID() }]);
    }
  };

  return (
    <>
      {loop.deleted && (
        <>
          <span className="text-rose-700">
            This Loop has been Deleted. You can restore it if you wish, or you
            can permanently delete it.
          </span>
          <RestorePermaDelete loop={loop} />
        </>
      )}
      <div className="relative flex flex-col xl:flex-row gap-4">
        <div className="w-full">
          <form action={action} className="flex flex-col gap-2 w-full">
            <input
              name="userId"
              type="text"
              className="hidden"
              readOnly
              value={session.user?.id}
            />
            <input
              name="timezone"
              type="number"
              className="hidden"
              readOnly
              value={new Date().getTimezoneOffset()}
            />
            <input
              name="loop"
              type="text"
              className="hidden"
              readOnly
              value={loop._id}
            />

            <div className="flex flex-col w-full">
              <Input
                name="loopNumber"
                label="Loop Number"
                type="number"
                placeholder="Number of loop..."
                min={0}
                max={100}
                value={loopNumber}
                setValue={(newValue) =>
                  setLoopNumber(Math.floor(newValue as number))
                }
              />
            </div>

            <div className="flex flex-col w-full">
              <Input
                name="title"
                label="Title"
                placeholder="Loop title..."
                required
                value={title ?? ""}
                setValue={(newValue) => setTitle(newValue as string)}
              />
            </div>

            <div className="flex flex-col w-full">
              <TextArea
                name="description"
                label="Description"
                maxLength={500}
                placeholder="Loop description..."
                required
                value={description ?? ""}
                setValue={(newValue) => setDescription(newValue as string)}
              />
            </div>
            <div className="flex flex-col w-full">
              <Input
                name="capacity"
                label="Total Capacity"
                type="number"
                placeholder="Total Capacity..."
                required
                min={1}
                max={999}
                value={capacity ?? 0}
                setValue={(newValue) =>
                  setCapacity(Math.floor(newValue as number))
                }
              />
            </div>

            <div className="flex flex-col w-full">
              {reservations.map((r) => (
                <ReservationItem
                  reservation={r}
                  setReservations={setReservations}
                  key={r.id}
                  allGroups={allGroups}
                  capacity={capacity}
                  pending={pending}
                />
              ))}
              <button
                className=" text-white bg-ncssm-blue brutal-sm px-4 font-bold flex items-center justify-center gap-2 mb-3"
                type="button"
                aria-disabled={
                  !(reservations.length < Math.min(allGroups.length, capacity))
                }
                onClick={addReservation}
              >
                Add Reservation <AdjustmentsHorizontalIcon className="size-5" />
              </button>
            </div>

            <div className="flex xs:flex-row flex-col xs:items-end gap-3 xs:gap-4 w-full">
              <div>
                <Input
                  name="departureDateTime"
                  label="Departure Time"
                  type="datetime-local"
                  className="w-full"
                  required
                  min="0000-01-01T00:00"
                  max="9999-12-31T23:59"
                  value={departureDateTime ?? ""}
                  setValue={(newValue) => {
                    setDepartureDateTime(newValue as string);
                    setPickUpDateTime(newValue as string);
                  }}
                />
              </div>
              <div className="flex-1">
                <Input
                  name="departureLoc"
                  label="Departure Location"
                  placeholder="Departure Location..."
                  required
                  className="w-full"
                  value={departureLocation ?? ""}
                  setValue={(newValue) =>
                    setDepartureLocation(newValue as string)
                  }
                />
              </div>
            </div>

            <div className="flex xs:flex-row flex-col xs:items-end gap-3 xs:gap-4 w-full">
              <div>
                <Input
                  name="pickUpDateTime"
                  label="Pick Up Time"
                  type="datetime-local"
                  className="w-full"
                  required
                  min={
                    departureDateTime.slice(0, -5) + "00:00" ||
                    "0000-01-01T00:00"
                  }
                  max={
                    addMinutes(departureDateTime, 60 * 24 * 7) ||
                    "9999-12-31T23:59"
                  }
                  value={pickUpDateTime ?? ""}
                  setValue={(newValue) => setPickUpDateTime(newValue as string)}
                />
              </div>
              <div className="flex-1">
                <Input
                  name="pickUpLoc"
                  label="Pick Up Location"
                  placeholder="Pick Up Location..."
                  className="w-full"
                  value={pickUpLocation ?? ""}
                  setValue={(newValue) => setPickUpLocation(newValue as string)}
                />
              </div>
            </div>
            <div className="flex flex-col w-full">
              <Input
                name="approxDriveTime"
                label="Approximate Drive Time (Minutes)"
                type="number"
                placeholder="Approximate drive time..."
                required
                min={0}
                max={60 * 24 * 3}
                value={approxDriveTime ?? 0}
                setValue={(newValue) =>
                  setApproxDriveTime(Math.floor(newValue as number))
                }
              />
            </div>
            <div className="flex flex-col w-full">
              <Input
                name="signUpOpenDateTime"
                label="Sign Ups Open"
                type="datetime-local"
                required
                min={
                  toISOStringOffset(loop.createdAt).slice(0, -2) + "00" ||
                  "0000-01-01T00:00"
                }
                max={departureDateTime || "9999-12-31T23:59"}
                value={signUpOpenDateTime ?? ""}
                setValue={(newValue) =>
                  setSignUpOpenDateTime(newValue as string)
                }
              />
            </div>
            <button
              className=" text-sm md:text-base w-full text-white flex items-center justify-center gap-2 h-fit bg-ncssm-green brutal-sm px-4 font-bold"
              type="submit"
              aria-disabled={pending}
            >
              Sav{pending ? "ing" : "e"} Changes
            </button>
            <p className="mt-2">{}</p>
          </form>
        </div>
        <div className="w-full xl:max-w-sm sticky top-20 h-fit">
          <p className="font-bold text-lg mb-2">Preview</p>
          <div className="w-full brutal-sm p-6">
            <LoopCard
              data={{
                reservations,
                title,
                description,
                approxDriveTime,
                capacity,
                departureLocation,
                departureDateTime,
                pickUpLocation,
                pickUpDateTime,
                filled: [],
                signUpOpenDateTime,
                deleted: false,
                loopNumber,
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export function ReservationItem({
  reservation,
  setReservations,
  capacity,
  allGroups,
  pending,
}: {
  reservation: Reservation;
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  capacity: number;
  allGroups: Awaited<ReturnType<typeof getGroups>>;
  pending: boolean;
}) {
  // console.log(reservation);
  // useEffect(() => {}, [reservation]);

  const deleteReservation = () => {
    setReservations((rs) => rs.filter((r2) => r2.id != reservation.id));
  };

  const onSlotsChange = (newValue: string | number | undefined) => {
    setReservations((prev) =>
      prev.map((r) =>
        r.id === reservation.id ? { ...r, slots: newValue as number } : r
      )
    );
  };

  const onGroupChange = (newValue: string) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? { ...r, group: newValue } : r))
    );
  };
  return (
    <div className="flex gap-2 items-end w-full" key={reservation.id}>
      <input
        name="reservations"
        type="text"
        className="hidden"
        readOnly
        value={String(reservation.id)}
      />
      <button
        type="button"
        onClick={deleteReservation}
        className="flex items-center justify-center p-2 h-fit mb-3 text-red-500"
      >
        <XMarkIcon className="size-5" />
      </button>
      <div className="flex items-center justify-center gap-2 w-full">
        <div className="flex flex-col w-full">
          <label
            htmlFor={"reservationGroup" + reservation.id}
            className="font-bold mb-1"
          >
            Group
            <span className="text-ncssm-blue">*</span>
          </label>
          <select
            name={"reservationGroup" + reservation.id}
            id={"reservationGroup" + reservation.id}
            className={"brutal-sm px-4 mb-3 min-w-0 w-full h-11 " + pending}
            required
            value={reservation.group ?? ""}
            onChange={(e) => onGroupChange(e.target.value)}
          >
            <option value={""} disabled>
              Select a group
            </option>
            {allGroups.map((v) => (
              <option value={v._id} key={v._id}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col w-full">
          <Input
            name={"reservationSlots" + reservation.id}
            type="number"
            min={1}
            max={capacity}
            label="Slots"
            className="mb-3 min-w-0 w-full"
            required
            value={reservation.slots!}
            setValue={onSlotsChange}
          />
        </div>
      </div>
    </div>
  );
}

const RestorePermaDelete = ({ loop }: { loop: Props["loop"] }) => {
  const [_state, action, pending] = useActionState(removeLoop, "");
  const [_state2, action2, pending2] = useActionState(deleteLoop, "");

  return (
    <div className={loop.deleted ? "grid grid-cols-2 gap-2" : ""}>
      <form action={action} className="flex-shrink-0 w-full">
        <input
          className="hidden"
          name="loop"
          readOnly
          value={String(loop._id)}
        />
        <button
          className={
            (loop.deleted ? "bg-ncssm-green" : "bg-rose-500") +
            " text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
          }
          type="submit"
          aria-disabled={pending}
        >
          {loop.deleted ? "Restor" : "Delet"}
          {pending ? "ing" : "e"}
        </button>
      </form>
      {/* {loop.deleted && (
        
        <form action={action2} className="flex-shrink-0 w-full">
          <input
            className="hidden"
            name="loop"
            readOnly
            value={String(loop._id)}
          />
          <button
            className={
              (loop.deleted ? "bg-ncssm-green" : "bg-rose-500") +
              " text-sm w-full text-white flex items-center justify-center gap-2 h-fit brutal-sm md:px-4 font-bold"
            }
            type="submit"
            aria-disabled={pending2}
          >
            Permanently Delet
            {pending2 ? "ing" : "e"}
          </button>
        </form>
      )} */}
    </div>
  );
};

export default EditLoopForm;
