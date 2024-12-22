import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import { ObjectId } from "mongodb";
import SignUp, { ISignUp } from "../models/SignUp";
import Loop from "../models/Loop";
import Group from "../models/Group";
import Users from "../models/Users";

/**
 * Gets a User's Sign Ups from DB
 * @param id object id of user
 * @returns group or null
 */
export const getUserSignUps = unstable_cache(
  async (userId: string) => {
    // connect to mongodb
    await mongoDB();

    // find all sign ups of a user
    try {
      const userSignups = await SignUp.find<ISignUp>({
        user: new ObjectId(userId),
      }).populate([
        { path: "user", select: "_id name email picture", model: Users },
        {
          path: "loop",
          select:
            "_id title description departureDateTime departureLocation pickUpDateTime signUpOpenDateTime pickUpLocation approxDriveTime capacity reservations filled deleted loopNumber",
          model: Loop,
        },
        { path: "group", select: "_id name", model: Group },
      ]);

      // convert mongodb document to usable js object
      return userSignups.map((signup) => {
        if (
          !signup.loop ||
          signup.loop instanceof ObjectId ||
          !signup.user ||
          signup.user instanceof ObjectId
        ) {
          throw new Error();
        }
        return {
          _id: String(signup._id),
          group:
            signup.group && !(signup.group instanceof ObjectId)
              ? {
                  _id: String(signup.group._id),
                  name: signup.group.name,
                }
              : undefined,
          user: {
            _id: String(signup.user._id),
            name: signup.user.name,
            email: signup.user.email,
            picture: signup.user.picture,
          },
          loop: {
            _id: String(signup.loop._id),
            title: signup.loop.title,
            description: signup.loop.description,
            departureDateTime: signup.loop.departureDateTime,
            departureLocation: signup.loop.departureLocation,
            pickUpDateTime: signup.loop.pickUpDateTime,
            signUpOpenDateTime: signup.loop.signUpOpenDateTime,
            pickUpLocation: signup.loop.pickUpLocation,
            approxDriveTime: signup.loop.approxDriveTime,
            capacity: signup.loop.capacity,
            reservations: signup.loop.reservations.map((r) => ({
              slots: r.slots,
              group: String(r.group),
            })),
            filled: signup.loop.filled.map((f) => String(f)),
            deleted: signup.loop.deleted,
            loopNumber: signup.loop.loopNumber,
          },
        };
      });
    } catch {
      return [];
    }
  },
  ["signups"],
  {
    tags: ["signups"],
    revalidate: 60,
  }
);
