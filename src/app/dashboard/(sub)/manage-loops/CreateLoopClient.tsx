"use client";

import React, { useActionState, useEffect, useRef, useState } from "react";
import { createLoopAction } from "./actions";
import Input from "@/app/_components/Inputs/Input";
import LoopCard from "@/app/_components/LoopCard";
import { getGroups } from "@/app/_db/queries/groups";
import { Session } from "next-auth";
import TextArea from "@/app/_components/Inputs/TextArea";
import { addMinutes, formatDate, toISOStringOffset } from "@/app/_lib/time";
import Modal from "@/app/_components/Modal";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { getLoop, getLoops } from "@/app/_db/queries/loops";
import Link from "next/link";

import {
  AdjustmentsHorizontalIcon,
  CheckIcon,
  ClipboardDocumentIcon,
  PaperAirplaneIcon,
  XMarkIcon,
} from "@heroicons/react/20/solid";
import { getSubscriptions } from "@/app/_db/queries/subscriptions";
// import { sendNotification } from "../notifications/actions";

type Props = {
  session: Session;
  allGroups: Awaited<ReturnType<typeof getGroups>>;
  allLoops: Awaited<ReturnType<typeof getLoops>>;
  // allSubs: Awaited<ReturnType<typeof getSubscriptions>>;
};

type Reservation = { slots?: number; group?: string; id: string };

const CreateLoopClient = ({ session, allGroups, allLoops }: Props) => {
  const searchParams = useSearchParams();
  const { replace } = useRouter();
  const pathname = usePathname();

  const param = searchParams.get("autofill");
  const autofill = param ? allLoops.find((f) => f._id === param) : undefined;

  useEffect(() => {
    const autofill = param ? allLoops.find((f) => f._id === param) : undefined;
    if (autofill) {
      setReservations(
        autofill.reservations
          ? autofill.reservations.map((r, i) => ({
              group: r.group,
              slots: r.slots,
              id: i + "",
            }))
          : []
      );
      setTitle(autofill.title);
      setDescription(autofill.description);
      setApproxDriveTime(autofill.approxDriveTime);
      setCapacity(autofill.capacity);
      setDepartureLocation(autofill.departureLocation);
      setDepartureDateTime("");
      setPickUpLocation(autofill.pickUpLocation ?? "");
      setPickUpDateTime("");
      setSignUpOpenDateTime(toISOStringOffset(new Date()));
    }
  }, [param]);

  const [_state, action, pending] = useActionState(createLoopAction, {});

  const [loopNumber, setLoopNumber] = useState<number>(
    autofill ? autofill.loopNumber ?? NaN : NaN
  );
  const [reservations, setReservations] = useState<Reservation[]>(
    autofill
      ? autofill.reservations
        ? autofill.reservations.map((r, i) => ({
            group: r.group,
            slots: r.slots,
            id: i + "",
          }))
        : []
      : []
  );

  const [title, setTitle] = useState<string>(autofill ? autofill.title : "");
  const [description, setDescription] = useState<string>(
    autofill ? autofill.description : ""
  );
  const [approxDriveTime, setApproxDriveTime] = useState<number>(
    autofill ? autofill.approxDriveTime : 0
  );
  const [capacity, setCapacity] = useState<number>(
    autofill ? autofill.capacity : 36
  );
  const [departureLocation, setDepartureLocation] = useState<string>(
    autofill ? autofill.departureLocation : "Goodwin Parking Lot"
  );
  const [departureDateTime, setDepartureDateTime] = useState<string>("");

  const [pickUpLocation, setPickUpLocation] = useState<string>(
    autofill ? autofill.pickUpLocation ?? "" : ""
  );
  const [pickUpDateTime, setPickUpDateTime] = useState<string>("");

  const [signUpOpenDateTime, setSignUpOpenDateTime] = useState<string>(
    toISOStringOffset(new Date())
  );

  const [shareModal, setShareModal] = useState("");

  useEffect(() => {
    if (!pending) {
      setReservations((r) => [...r]);
    }

    if (_state.overall === "success" && !pending) {
      setCopied(false);
      // setNotified(false);
      setShareModal(departureDateTime);

      setReservations([]);
      setTitle("");
      setDescription("");
      setApproxDriveTime(0);
      setCapacity(36);
      setDepartureLocation("Goodwin Parking Lot");
      setDepartureDateTime("");
      setPickUpLocation("");
      setPickUpDateTime("");
      setSignUpOpenDateTime(toISOStringOffset(new Date()));

      const params = new URLSearchParams(searchParams);
      params.delete("autofill");
      replace(`${pathname}?${params.toString()}`, {
        scroll: false,
      });
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

  const [windowLocation, setWindowLocation] = useState<Location | null>(null);
  const [copied, setCopied] = useState(false);
  // const [notified, setNotified] = useState(false);

  useEffect(() => {
    setWindowLocation(window.location);
  }, []);

  const shareUrl = () =>
    `${windowLocation?.protocol}//${
      windowLocation?.host
    }/${relativeShareUrl()}`;

  const relativeShareUrl = () =>
    `loops/?p=1&start=${shareModal.slice(0, -6)}&end=${shareModal.slice(
      0,
      -6
    )}`;

  // const gmailDraft = () => {
  //   const weekday = formatDate(shareModal).split(",")[0];
  //   let date = formatDate(shareModal, false).split(", ");
  //   date.shift();
  //   const subject = encodeURIComponent(`${weekday} Loops ${date.join(", ")}`);
  //   const body = encodeURIComponent(`${shareUrl()}`);
  //   return `https://mail.google.com/mail/?view=cm&su=${subject}&body=${body}`;
  // };

  return (
    <>
      <Modal
        isOpen={shareModal != ""}
        onClose={(r) => setShareModal("")}
        className="w-full max-w-sm"
        noTimeOut
      >
        <div className="w-full">
          <div className="mx-auto bg-ncssm-green text-white brutal-sm size-10 flex flex-col items-center justify-center">
            <CheckIcon className="size-4 stroke-[4]" />
          </div>
          <p className="mt-2 text-xl text-center font-bold">
            Created Loop Successfully
          </p>
          <button
            onClick={() => {
              navigator.clipboard.writeText(shareUrl());
              setCopied(true);
            }}
            className={
              "mt-3 brutal-sm px-4 flex items-center justify-center w-full text-left " +
              (copied ? "bg-ncssm-green/30" : "")
            }
          >
            <div className="flex-1 leading-5">
              {!copied ? (
                <>
                  <span className="block font-bold">Copy Link</span>
                  <span className="text-sm leading-3">
                    Link for All {formatDate(shareModal, false)} Loops
                  </span>
                </>
              ) : (
                <span className="block font-bold">Copied!</span>
              )}
            </div>
            <ClipboardDocumentIcon className="size-5" />
          </button>
          {/* <button
            onClick={async () => {
              if (!notified)
                await sendNotification(
                  `${formatDate(shareModal).split(", ")[0]} Loops Posted`,
                  "New Loops Posted! Click to view...",
                  relativeShareUrl()
                );
              setNotified(true);
            }}
            className={
              "mt-3 brutal-sm px-4 flex items-center justify-center w-full text-left " +
              (notified ? "bg-ncssm-green/30" : "")
            }
          >
            <div className="flex-1 leading-5">
              {!notified ? (
                <>
                  <span className="block font-bold">Push Notification</span>
                  <span className="text-sm leading-3">
                    Notify that {formatDate(shareModal, false)} Loops are
                    posted.
                  </span>
                </>
              ) : (
                <span className="block font-bold">Notified!</span>
              )}
            </div>
            <PaperAirplaneIcon className="size-5" />
          </button> */}
          {/* <Link
            href={gmailDraft()}
            target="_blank"
            className="mt-3 brutal-sm px-4 flex items-center justify-center w-full text-left"
          >
            <div className="flex-1 leading-5">
              <span className="block font-bold">Share with Gmail</span>
              <span className="text-sm leading-3">
                Drafts email sharing All {formatDate(shareModal, false)} Loops
              </span>
            </div>
            <ExternalLinkIcon />
          </Link> */}
        </div>
      </Modal>
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
                  setCapacity(Math.floor(Math.floor(newValue as number)))
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
                  toISOStringOffset(new Date()).slice(0, -2) + "00" ||
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
              Creat{pending ? "ing" : "e"}
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

export default CreateLoopClient;
