import { unstable_cache } from "next/cache";
import mongoDB from "../connect";
import Users, { IUsers } from "../models/Users";

export const getFilteredUsers = unstable_cache(
  async () => {
    // connect to mongodb
    await mongoDB();

    // find all users from db
    const allUsers = await Users.find<IUsers>({});

    // convert mongodb document to usable js object
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
