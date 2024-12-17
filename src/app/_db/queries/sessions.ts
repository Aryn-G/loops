import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Sessions, { ISessions } from "../models/Sessions";
import { ObjectId } from "mongodb";

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
