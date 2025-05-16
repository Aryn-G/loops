"use server";

import { getGroups, getUserGroupsHelper } from "../_db/queries/groups";
import { getLoop } from "../_db/queries/loops";
import { isDateBetween, toISOStringOffset } from "./time";

/**
 * Sign Up Array of Users to a Loop
 * @param loop Loop which users are signing up for
 * @param userIds array of user ids signing up
 * @param allGroups all student Groups
 * @returns sign up objects ready for DB and errors
 */
export async function signUpMany(
  loop: NonNullable<Awaited<ReturnType<typeof getLoop>>>,
  userIds: string[],
  allGroups: NonNullable<Awaited<ReturnType<typeof getGroups>>>
) {
  // `many` variable is only for error handling purposes
  const many = userIds.length > 1;

  // how many slots from each reservation group are filled
  const reservedSlotsUsed: { [key: string]: number } = {};

  // for every signup
  loop.filled.forEach((signUp) => {
    // if the sign up is using a reserved slot
    if (signUp.group) {
      reservedSlotsUsed[String(signUp.group._id)] =
        (reservedSlotsUsed[String(signUp.group._id)] || 0) + 1;
    }
  });

  let totalSlotsUsed = loop.filled.length;

  const result: {
    user: string;
    loop: string;
    group?: string;
    waitlist?: boolean;
  }[] = [];

  const errors: string[] = [];

  // handle closed signups
  const notOpenYet = isDateBetween(
    undefined,
    toISOStringOffset(new Date()),
    toISOStringOffset(loop.signUpOpenDateTime)
  );
  const windowPassed = isDateBetween(
    toISOStringOffset(loop.departureDateTime),
    toISOStringOffset(new Date()),
    undefined
  );
  if (windowPassed || notOpenYet) {
    errors.push("Sign Up Window is Closed");
    return { result, errors };
  }

  // for every user trying to sign up
  for (const userId of userIds) {
    let signedUp = false;

    // if user is already signed up, move to next user
    const found = loop.filled.find((f) => String(f.user._id) === userId);
    if (found !== undefined) {
      errors.push((many ? userId + " " : "") + "Already Signed Up");
      continue;
    }

    // get loop's reservation groups
    // ensure that reservation group contains current user id

    const reservations = loop.reservations
      .map((res) => {
        const userGroup = getUserGroupsHelper(allGroups, userId).find(
          (userGroup) => String(userGroup.group._id) === String(res.group._id)
        );
        if (userGroup) {
          return { res, level: userGroup.level };
        } else {
          return null;
        }
      })
      .filter((res) => res !== null)
      .sort((a, b) => a.level - b.level)
      .map((res) => res.res);

    // go through each reservation group
    for (const reservation of reservations) {
      // if current reservation group isn't tracked, track it
      if (!reservedSlotsUsed[String(reservation.group._id)])
        reservedSlotsUsed[String(reservation.group._id)] = 0;

      // if slots aren't filled up, sign up user
      if (
        reservedSlotsUsed[String(reservation.group._id)] < reservation.slots
      ) {
        reservedSlotsUsed[String(reservation.group._id)]++;
        totalSlotsUsed++;
        result.push({
          user: userId,
          loop: loop._id,
          group: String(reservation.group._id),
        });
        signedUp = true;
        break;
      }
    }

    // if signed up, move to next user
    if (signedUp) continue;

    // else user did not fit into any reservation group

    // if there are any slots left
    // capacity - totalUnreservedUsed - totalReserved
    // = capacity - (totalUsed - totalReserevedUsed) - totalReserved

    // then sign up user
    if (
      loop.capacity -
        (totalSlotsUsed -
          Object.values(reservedSlotsUsed).reduce((a, b) => a + b, 0)) -
        Object.values(loop.reservations).reduce((a, b) => a + b.slots, 0) >
      0
    ) {
      totalSlotsUsed++;
      result.push({
        user: userId,
        loop: loop._id,
      });
      continue;
    }

    // user didn't fit into any slot
    errors.push("Not slots available" + (many ? " for " + userId : ""));

    // in the future, add them to waitlist...
    // result.push({user: userId, loop: loop._id, waitlist: true})
  }

  return { result, errors };
}
