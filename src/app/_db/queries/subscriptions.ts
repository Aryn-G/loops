import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Subscription, { ISubscription } from "../models/Subscription";
import { ObjectId } from "mongodb";
import Sessions from "../models/Sessions";

export const getSubscriptions = unstable_cache(
  async () => {
    // connect to mongodb
    await mongoDB();

    // find all users from db
    const allSubs = await Subscription.find<ISubscription>({});

    // convert mongodb document to usable js object
    return allSubs.map((sub) => {
      if (!sub.session || sub.session instanceof ObjectId) {
        throw new Error();
      }
      return {
        _id: String(sub._id),
        session: String(sub.session),
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        // data: sub.data,
        createdAt: sub.createdAt,
      };
    });
  },
  ["subscriptions"],
  {
    tags: ["subscriptions"],
    revalidate: 60,
  }
);

/**
 * Gets a User's Groups from DB
 * @param id object id of user
 * @returns group or null
 */
export const getUserSubscriptions = unstable_cache(
  async (userId: string) => {
    // connect to mongodb
    await mongoDB();

    // find all sessiond with user
    const userSub = await Subscription.find<ISubscription>({
      user: new ObjectId(userId),
    }).populate({
      path: "session",
      model: Sessions,
      select:
        "_id sessionToken userId expires createdAt updatedAt browser device deviceVendor deviceModel os location ip",
    });

    // convert mongodb document to usable js object
    return userSub.map((sub) => {
      if (!sub.session || sub.session instanceof ObjectId) {
        throw new Error();
      }
      return {
        _id: String(sub._id),
        session: {
          _id: String(sub.session._id),
          sessionToken: sub.session.sessionToken,
          userId: sub.session.userId,
          expires: sub.session.expires,
          createdAt: sub.session.createdAt,
          updatedAt: sub.session.updatedAt,
          browser: sub.session.browser,
          device: sub.session.device,
          deviceVendor: sub.session.deviceVendor,
          deviceModel: sub.session.deviceModel,
          os: sub.session.os,
          location: sub.session.location,
          ip: sub.session.ip,
        },
        endpoint: sub.endpoint,
        keys: { p256dh: sub.keys.p256dh, auth: sub.keys.auth },
        // data: sub.data,
        createdAt: sub.createdAt,
      };
    });
  },
  ["subscriptions"],
  {
    tags: ["subscriptions"],
    revalidate: 60,
  }
);
