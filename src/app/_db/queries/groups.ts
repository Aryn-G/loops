import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Group, { IGroup } from "../models/Group";
import Users from "../models/Users";

/**
 * Gets All Groups from DB
 * @param deleted
 * @returns all groups
 */
export const getGroups = unstable_cache(
  async (deleted: boolean | null = false) => {
    // connect to mongodb
    await mongoDB();

    // if deleted == true
    //   find all deleted groups
    // if deleted == false
    //   find all non deleted groups
    // else find all groups
    const allGroups = await Group.find<IGroup>(
      deleted != null ? { deleted } : {}
    );

    // convert mongodb document to usable js object
    return allGroups.map((group) => ({
      _id: String(group._id),
      users: group.users.map((u) => String(u)),
      name: group.name,
      deleted: group.deleted,
    }));
  },
  ["groups"],
  {
    tags: ["groups"],
    revalidate: 60,
  }
);

/**
 * Gets Group by id from DB
 * @param id object id of document
 * @returns group or null
 */
export const getGroup = unstable_cache(
  async (id: string) => {
    // connect to mongodb
    await mongoDB();

    // find group by id and populate necessary paths
    try {
      const group = await Group.findById<IGroup>(id).populate([
        {
          path: "users",
          select: "_id name email picture",
          model: Users,
        },
      ]);

      if (!group) return null;

      // convert mongodb document to usable js object
      return {
        _id: String(group._id),
        users: group.users.map((u: any) => ({
          name: u.name,
          email: u.email,
          picture: u.picture,
          _id: String(u._id),
        })),
        name: group.name,
        deleted: group.deleted,
      };
    } catch {
      return null;
    }
  },
  ["groups"],
  {
    tags: ["groups"],
    revalidate: 60,
  }
);

/**
 * Gets a User's Groups from DB
 * @param id object id of user
 * @returns group or null
 */
export const getUserGroups = unstable_cache(
  async (userId: string) => {
    // connect to mongodb
    await mongoDB();

    // find all groups containing a user
    try {
      const userGroups = await Group.find({ users: userId, deleted: false });

      // convert mongodb document to usable js object
      return userGroups.map((group) => ({
        _id: String(group._id),
        users: group.users.map((u: any) => String(u)),
        name: group.name,
        deleted: false,
      }));
    } catch {
      return [];
    }
  },
  ["groups"],
  {
    tags: ["groups"],
    revalidate: 60,
  }
);
