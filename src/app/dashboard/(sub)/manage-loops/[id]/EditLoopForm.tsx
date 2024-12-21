"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { editLoopAction } from "./actions";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "@/app/_components/LoopCard";

import { AdjustmentsHorizontalIcon } from "@heroicons/react/20/solid";

import { getGroups } from "@/app/_db/queries/groups";
import mongoose from "mongoose";
import { Session } from "next-auth";
import TextArea from "@/app/_components/Inputs/TextArea";
import { addMinutes, formatDate, toISOStringOffset } from "@/app/_lib/time";
import Modal from "@/app/_components/Modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLoop, getLoops } from "@/app/_db/queries/loops";

import { ReservationItem } from "../CreateLoopClient";

type Props = {
  session: Session;
  allGroups: Awaited<ReturnType<typeof getGroups>>;
  loop: NonNullable<Awaited<ReturnType<typeof getLoop>>>;
};

type Reservation = { slots?: number; group?: string; id: string };

const EditLoopForm = ({ session, allGroups, loop }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const [_state, action, pending] = useActionState(editLoopAction, {});

  const [loopNumber, setLoopNumber] = useState<number>(loop.loopNumber ?? NaN);
  const [reservations, setReservations] = useState<Reservation[]>(
    loop.reservations
      ? loop.reservations.map((r, i) => ({
          group: r.group._id,
          slots: r.slots,
          id: i + "",
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
    loop.departureDateTime
  );

  const [pickUpLocation, setPickUpLocation] = useState<string>(
    loop.pickUpLocation ?? ""
  );
  const [pickUpDateTime, setPickUpDateTime] = useState<string>(
    loop.pickUpDateTime
  );

  const [signUpOpenDateTime, setSignUpOpenDateTime] = useState<string>(
    loop.signUpOpenDateTime
  );
  useEffect(() => {
    if (!pending) {
      setReservations((r) => [...r]);
    }
  }, [pending]);

  const addReservation = () => {
    if (reservations.length < Math.min(allGroups.length, capacity)) {
      setReservations((r) => [
        ...r,
        { group: "", slots: 1, id: self.crypto.randomUUID() },
      ]);
    }
  };

  return (
    <>
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
                min={loop.createdAt.slice(0, -2) + "00" || "0000-01-01T00:00"}
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

export default EditLoopForm;
