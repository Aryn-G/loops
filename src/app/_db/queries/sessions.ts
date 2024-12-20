import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Sessions, { ISessions } from "../models/Sessions";
import { ObjectId } from "mongodb";
import Users, { IUsers } from "../models/Users";

/**
 * Gets a User's Groups from DB
 * @param id object id of user
 * @returns group or null
 */
export const getUserSessions = unstable_cache(
  async (userId: string) => {
    // connect to mongodb
    await mongoDB();

    // find all sessiond with user
    try {
      const userSessions = await Sessions.find<ISessions>({
        userId: new ObjectId(userId),
      });

      // convert mongodb document to usable js object
      return userSessions.map((session) => {
        return {
          id: String(session._id),
          expires: session.expires,
          browser: session.browser,
          device: session.device,
          deviceVendor: session.deviceVendor,
          deviceModel: session.deviceModel,
          os: session.os,
          location: session.location,
          ip: session.ip,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
        };
      });
    } catch {
      return [];
    }
  },
  ["sessions"],
  {
    tags: ["sessions"],
    revalidate: 60,
  }
);

/**
 * Gets Group by id from DB
 * @param id object id of document
 * @returns group or null
 */
export const getCachedSessionAndUser = unstable_cache(
  async (sessionToken: string) => {
    // connect to mongodb
    await mongoDB();

    // find group by id and populate necessary paths
    try {
      const session = await Sessions.findOne<ISessions>({
        sessionToken,
      });
      if (!session) return { session: null, user: null };
      const user = await Users.findById<IUsers>(session.userId);
      if (!user) return { session, user: null };

      // console.log(
      //   "getCachedSessionAndUser(...) at ",
      //   new Date().toLocaleTimeString("en-US", {
      //     hour12: true,
      //     minute: "2-digit",
      //     hour: "2-digit",
      //     second: "2-digit",
      //   })
      // );
      return {
        user: user.toObject(),
        session: session.toObject(),
      };
    } catch {
      return { session: null, user: null };
    }
  },
  ["auth"],
  {
    tags: ["auth"],
    revalidate: 60,
  }
);
