import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Loop, { ILoop } from "../models/Loop";
import Users from "../models/Users";
import Group from "../models/Group";
import SignUp from "../models/SignUp";

/**
 * Gets All Loops from DB
 * @param deleted
 * @returns all loops
 */
export const getLoops = unstable_cache(
  async (deleted: boolean | null = false, published: boolean | null = true) => {
    // connect to mongodb
    await mongoDB();

    const query: Record<string, any> = {};
    if (deleted != null) query["deleted"] = deleted;
    if (published != null) query["published"] = published;
    const allLoops = await Loop.find<ILoop>(query);

    // convert mongodb document to usable js object
    return allLoops.map((loop) => ({
      _id: String(loop._id),
      title: loop.title,
      description: loop.description,
      departureDateTime: loop.departureDateTime,
      departureLocation: loop.departureLocation,
      pickUpDateTime: loop.pickUpDateTime,
      signUpOpenDateTime: loop.signUpOpenDateTime,
      pickUpLocation: loop.pickUpLocation,
      approxDriveTime: loop.approxDriveTime,
      capacity: loop.capacity,
      reservations: loop.reservations.map((r) => ({
        slots: r.slots,
        group: String(r.group),
      })),
      filled: loop.filled.map((f) => String(f)),
      deleted: loop.deleted,
      published: loop.published,
      canceled: loop.canceled,
      loopNumber: loop.loopNumber,
      createdAt: loop.createdAt,
      createdBy: String(loop.createdBy),
    }));
  },
  ["loopsTag"],
  {
    tags: ["loopsTag"],
    revalidate: 60,
  }
);

/**
 * Gets Loop by id from DB
 * @param id object id of document
 * @returns group or null
 */
export const getLoop = unstable_cache(
  async (id: string) => {
    // connect to mongodb
    await mongoDB();

    // find loop by id and populate necessary paths
    try {
      const loop = await Loop.findById<ILoop>(id).populate([
        {
          path: "filled",
          select: "_id lood user group createdAt",
          model: SignUp,
          populate: [
            { path: "user", select: "name email _id picture", model: Users },
            { path: "group", select: "name _id" },
          ],
        },
        { path: "reservations.group", select: "name _id", model: Group },
      ]);

      if (!loop) return null;

      // convert mongodb document to usable js object
      return {
        _id: String(loop._id),
        title: loop.title,
        description: loop.description,
        departureDateTime: loop.departureDateTime,
        departureLocation: loop.departureLocation,
        pickUpDateTime: loop.pickUpDateTime,
        signUpOpenDateTime: loop.signUpOpenDateTime,
        pickUpLocation: loop.pickUpLocation,
        approxDriveTime: loop.approxDriveTime,
        capacity: loop.capacity,
        reservations: loop.reservations.map((r: any) => ({
          slots: r.slots as number,
          group: { name: r.group.name as string, _id: String(r.group._id) },
        })),
        filled: loop.filled.map((v: any) => ({
          _id: String(v._id),
          createdAt: v.createdAt as Date,
          user:
            v.user !== null
              ? {
                  name: v.user.name as string,
                  email: v.user.email as string,
                  picture: v.user.picture as string | undefined,
                  _id: String(v.user._id),
                }
              : {
                  name: "[deleted user]",
                  email: null,
                  picture: null,
                  _id: null,
                },
          group: v.group
            ? { name: v.group.name as string, _id: String(v.group._id) }
            : undefined,
        })),
        published: loop.published ?? true,
        canceled: loop.canceled ?? false,
        deleted: loop.deleted,
        loopNumber: loop.loopNumber,
        createdAt: loop.createdAt,
        createdBy: String(loop.createdBy),
      };
    } catch {
      return null;
    }
  },
  ["loopsTag"],
  {
    tags: ["loopsTag"],
    revalidate: 60,
  }
);
