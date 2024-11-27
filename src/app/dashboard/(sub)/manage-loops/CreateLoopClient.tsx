"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { createLoopAction } from "./actions";
import { ExtendedSession } from "@/auth";
import Input from "@/app/_components/Input";
import LoopCard from "@/app/_components/LoopCard";
import Bell from "@/app/_icons/Bell";
import CaretRight from "@/app/_icons/CaretRight";
import Customize from "@/app/_icons/Customize";
import XMark from "@/app/_icons/XMark";
import { getGroups } from "@/app/_lib/groups";
import mongoose from "mongoose";

type Props = {
  session: ExtendedSession;
  allGroups: Awaited<ReturnType<typeof getGroups>>;
};

const CreateLoopClient = ({ session, allGroups }: Props) => {
  const [_state, action, pending] = useActionState(createLoopAction, "");

  const [date, setDate] = useState<Date>();
  const [reservations, setReservations] = useState<
    { slots?: number; group?: string; id: number }[]
  >([]);

  const [title, setTitle] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [approxDriveTime, setApproxDriveTime] = useState<number>();
  const [capacity, setCapacity] = useState<number>();
  const [departureLocation, setDepartureLocation] = useState<string>();
  const [departureTime, setDepartureTime] = useState<string>();

  const [loopNumber, setLoopNumber] = useState<number>();
  const [pickUpLocation, setPickUpLocation] = useState<string>();
  const [pickUpTime, setPickUpTime] = useState<string>();

  const descriptionRef = useRef<HTMLTextAreaElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (reservations.length > 0 && !pending) {
      setReservations([]);
      formRef.current?.reset();
      handleChange();
    }
  }, [pending]);

  useEffect(() => {
    if (formRef.current) {
      handleChange();
    }
  }, []);

  const handleChange = () => {
    if (formRef.current) {
      const formData = new FormData(formRef.current);
      setDate(
        formData.get("date")
          ? new Date((formData.get("date") as string) + "T00:00:00")
          : undefined
      );

      console.log(formData.get("date"));

      setTitle(
        (formData.get("title") as string) != ""
          ? (formData.get("title") as string)
          : undefined
      );

      setDescription(
        (formData.get("description") as string) != ""
          ? (formData.get("description") as string)
          : undefined
      );

      setDepartureLocation(
        (formData.get("departureLoc") as string) != ""
          ? (formData.get("departureLoc") as string)
          : undefined
      );
      setDepartureTime(
        (formData.get("departureTime") as string) != ""
          ? (formData.get("departureTime") as string)
          : undefined
      );
      setPickUpLocation(
        (formData.get("pickUpLoc") as string) != ""
          ? (formData.get("pickUpLoc") as string)
          : undefined
      );
      setPickUpTime(
        (formData.get("pickUpTime") as string) != ""
          ? (formData.get("pickUpTime") as string)
          : undefined
      );

      setLoopNumber(
        (formData.get("loopNum") as string) != ""
          ? parseInt(formData.get("loopNum") as string)
          : undefined
      );

      setApproxDriveTime(
        (formData.get("approxDriveTime") as string) != ""
          ? parseInt(formData.get("approxDriveTime") as string)
          : undefined
      );

      setCapacity(
        (formData.get("capacity") as string) != ""
          ? parseInt(formData.get("capacity") as string)
          : undefined
      );
    }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-4">
      <div className="w-full">
        <button className="mb-2 underline underline-offset-2">
          Autofill From Past Loop Data
        </button>
        <form
          action={action}
          className="flex flex-col w-full rounded-lg"
          ref={formRef}
          onChange={handleChange}
        >
          {/* <input
            name="userId"
            type="text"
            className="hidden"
            readOnly
            value={session.user?.id}
          /> */}
          {/* <div className="flex gap-4 w-full"> */}
          {/* <div className="flex-1"> */}
          <Input
            name="date"
            label="Date"
            type="date"
            required
            className="w-full"
          />
          {/* </div> */}
          {/* <div className="flex-1">
              <Input
                name="loopNum"
                label="Loop Number"
                type="number"
                required
                minNum={1}
                className="w-full"
              />
            </div> */}
          {/* </div> */}
          <Input
            name="title"
            label="Title"
            placeholder="Loop title..."
            required
          />
          <Input
            name="description"
            label="Description"
            textarea
            maxLength={500}
            placeholder="Loop description..."
            required
            ref={descriptionRef}
          />
          <div className="flex gap-2 items-end">
            <div className="flex-1">
              <Input
                name="capacity"
                label="Total Capacity"
                type="number"
                minNum={1}
                required
                className="w-full"
                startingValue="36"
              />
            </div>
          </div>

          <div className="flex flex-col w-full">
            {reservations.map((r) => (
              <div className="flex gap-2 items-end w-full" key={r.id}>
                <button
                  type="button"
                  onClick={() => {
                    console.log(reservations);
                    console.log(reservations.filter((r2) => r2.id != r.id));
                    setReservations((rs) => rs.filter((r2) => r2.id != r.id));
                  }}
                  className="flex items-center justify-center p-2 h-fit mb-3 text-red-500"
                >
                  <XMark />
                </button>
                <div className="flex items-center justify-center gap-2 w-full">
                  <div className="flex flex-col w-full">
                    <input
                      name="reservations"
                      type="number"
                      className="hidden"
                      readOnly
                      value={r.id}
                    />
                    <label
                      htmlFor={"reservationGroup" + r.id}
                      className="font-bold"
                    >
                      Group
                      <span className="text-ncssm-blue">*</span>
                    </label>
                    <select
                      name={"reservationGroup" + r.id}
                      id={"reservationGroup" + r.id}
                      className="bg-white ring-1 ring-black shadow-brutal-sm rounded-lg px-4 py-2 mb-3 min-w-0 w-full"
                      required
                    >
                      {allGroups.map((v) => (
                        <option value={v._id}>{v.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col w-full">
                    <label
                      htmlFor={"reservationSlots" + r.id}
                      className="font-bold"
                    >
                      Slots
                      <span className="text-ncssm-blue">*</span>
                    </label>
                    <input
                      name={"reservationSlots" + r.id}
                      id={"reservationSlots" + r.id}
                      type="number"
                      min={1}
                      max={capacity}
                      className="bg-white ring-1 ring-black shadow-brutal-sm rounded-lg px-4 py-2 mb-3 min-w-0 w-full"
                      placeholder="Type here..."
                      required
                    />
                  </div>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                if (reservations.length !== allGroups.length) {
                  setReservations((r) => [
                    ...r,
                    { group: "", slots: 0, id: (r[r.length - 1]?.id ?? 0) + 1 },
                  ]);
                }
              }}
              className="mt-3 bg-ncssm-orange font-bold flex items-center justify-center px-4 py-2 gap-2 bg rounded-lg shadow-brutal-sm ring-1 ring-black mb-3"
            >
              Add Reservation <Customize />
            </button>
          </div>

          <div className="flex gap-4 w-full">
            <div>
              <Input
                name="departureTime"
                label="Departure Time"
                type="time"
                required
              />
            </div>
            <div className="flex-1">
              <Input
                name="departureLoc"
                label="Departure Location"
                startingValue="Goodwin Parking Lot"
                placeholder="Departure Location..."
                required
                className="w-full"
              />
            </div>
          </div>

          <div className="flex gap-4 w-full">
            <div>
              <Input
                name="pickUpTime"
                label="Pick Up Time"
                type="time"
                required
              />
            </div>
            <div className="flex-1">
              <Input
                name="pickUpLoc"
                label="Pick Up Location"
                placeholder="Pick Up Location..."
                className="w-full"
              />
            </div>
          </div>
          <Input
            name="approxDriveTime"
            label="Approximate Drive Time (Minutes)"
            type="number"
            placeholder="Approximate drive time..."
            required
            minNum={0}
          />

          <button
            className="text-sm md:text-base w-full text-white flex items-center justify-center gap-2 h-fit bg-ncssm-blue shadow-brutal-sm ring-1 ring-black px-2 md:px-5 py-2 rounded-lg font-bold"
            type="submit"
            aria-disabled={pending}
          >
            Creat{pending ? "ing" : "e"}
          </button>
          <p className="mt-2">{_state as string}</p>
        </form>
      </div>
      <div className="w-full max-w-sm">
        <p className="font-bold text-lg mb-2">Preview</p>
        <LoopCard
          data={{
            date,
            reservations,
            title,
            description,
            approxDriveTime,
            capacity,
            departureLocation,
            departureTime,
            // loopNumber: undefined,
            pickUpLocation,
            pickUpTime,
          }}
        />
      </div>
    </div>
  );
};

export default CreateLoopClient;
