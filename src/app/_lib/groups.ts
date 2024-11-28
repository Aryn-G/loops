import { unstable_cache } from "next/cache";
import mongoDB from "../_mongo/connect";
import Group, { IGroup } from "../_mongo/models/Group";

export const getGroups = unstable_cache(
  async (deleted: boolean = false) => {
    await mongoDB();

    const allGroups = await Group.find<IGroup>({ deleted });

    return allGroups.map((group) => ({
      _id: String(group._id),
      users: group.users,
      name: group.name,
      deleted,
    }));
  },
  ["groups"],
  {
    tags: ["groups"],
    revalidate: 60,
  }
);

export const getUserGroups = unstable_cache(async (email: string) => {
  await mongoDB();

  const userGroups = await Group.find({ users: email, deleted: false });

  return userGroups.map((group) => ({
    _id: String(group._id),
    users: group.users,
    name: group.name,
    deleted: false,
  }));
});
