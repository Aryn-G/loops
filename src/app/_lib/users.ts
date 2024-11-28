import { unstable_cache } from "next/cache";
import mongoDB from "../_mongo/connect";
import Users, { IUsers } from "../_mongo/models/Users";

export const getFilteredUsers = unstable_cache(
  async () => {
    await mongoDB();

    const allUsers = await Users.find<IUsers>({});

    return allUsers.map((user) => {
      return {
        _id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
        picture: user.picture,
      };
    });
  },
  ["filteredUsers"],
  {
    tags: ["filteredUsers"],
    revalidate: 60,
  }
);
