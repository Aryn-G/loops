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
      subgroups: group.subgroups.map((u) => String(u)),
      name: group.name,
      deleted: group.deleted,
      count: countUsers(String(group._id), allGroups),
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
      const allGroups = await Group.find<IGroup>({});

      const group = await Group.findById<IGroup>(id).populate([
        {
          path: "users",
          select: "_id name email picture",
          model: Users,
        },
        {
          path: "subgroups",
          select: "_id name deleted",
          model: Group,
        },
      ]);

      if (!group) return null;

      // convert mongodb document to usable js object
      return {
        _id: String(group._id),
        users: group.users.map((u: any) =>
          u !== null
            ? {
                name: u.name,
                email: u.email,
                picture: u.picture,
                _id: String(u._id),
              }
            : { name: "[deleted user]", email: null, picture: null, _id: null }
        ),
        subgroups: group.subgroups.map((g: any) => ({
          _id: String(g._id),
          name: String(g.name),
          deleted: g.deleted,
          users: g.users,
          count: countUsers(String(g._id), allGroups),
        })),
        name: group.name,
        deleted: group.deleted,
        count: countUsers(String(group._id), allGroups),
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
      const allGroups = await Group.find<IGroup>();
      const groupMap = new Map<string, IGroup>(
        allGroups.map((g) => [String(g._id), g])
      );
      const memo = new Map<string, boolean>();

      // recursively check if user is in group
      function userInGroup(
        groupId: string,
        visited = new Set<string>()
      ): boolean {
        if (memo.has(groupId)) return memo.get(groupId)!;
        if (visited.has(groupId)) return false;

        const group = groupMap.get(groupId);
        if (!group || group.deleted) {
          memo.set(groupId, false);
          return false;
        }

        visited.add(groupId);

        if (group.users.some((u) => u.toString() === userId)) {
          memo.set(groupId, true);
          return true;
        }

        for (const subId of group.subgroups) {
          if (userInGroup(subId.toString(), visited)) {
            memo.set(groupId, true);
            return true;
          }
        }

        memo.set(groupId, false);
        return false;
      }

      // matching groups
      const userGroups = allGroups.filter(
        (group) => !group.deleted && userInGroup(String(group._id))
      );

      // convert mongodb document to usable js object
      return userGroups.map((group) => ({
        _id: String(group._id),
        users: group.users.map((u: any) => String(u)),
        name: group.name,
        deleted: false,
        count: countUsers(String(group._id), allGroups),
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

const countUsers = (groupId: string, allGroups: IGroup[]) => {
  const groupMap = new Map(allGroups.map((g) => [String(g._id), g]));

  const visited = new Set<string>();
  const userSet = new Set<string>();

  function collectUsers(id: string) {
    if (visited.has(id)) return;
    visited.add(id);

    const group = groupMap.get(id);
    if (!group || group.deleted) return; // Skip deleted groups

    group.users.forEach((user) => userSet.add(String(user)));
    group.subgroups.forEach((sub) => collectUsers(String(sub)));
  }

  collectUsers(String(groupId));
  return userSet.size;
};

export const countUsersInGroup = unstable_cache(
  async (groupId: string) => {
    await mongoDB();

    try {
      const allGroups = await Group.find<IGroup>({});
      return countUsers(groupId, allGroups);
    } catch {
      return -1;
    }
  },
  ["groups"],
  {
    tags: ["groups"],
    revalidate: 60,
  }
);
