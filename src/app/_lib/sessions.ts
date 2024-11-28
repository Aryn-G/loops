import { unstable_cache } from "next/cache";
import mongoDB from "../_mongo/connect";
import Sessions, { ISessions } from "../_mongo/models/Sessions";
import { ObjectId } from "mongodb";

export const getUserSessions = unstable_cache(
  async (userId: string) => {
    await mongoDB();

    const userSessions = await Sessions.find<ISessions>({
      userId: new ObjectId(userId),
    });

    return userSessions.map((session) => {
      return {
        id: String(session._id),
        expires: session.expires,
        browser: session.browser,
        device: session.device,
        os: session.os,
        location: session.location,
        ip: session.ip,
        createdAt: session.createdAt,
        updatedAt: session.updatedAt,
      };
    });
  },
  ["sessions"],
  {
    tags: ["sessions"],
    revalidate: 60,
  }
);
