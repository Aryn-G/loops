"use server";

import mongoDB from "@/app/_db/connect";
import Users, { IUsers } from "@/app/_db/models/Users";
import { revalidateTag } from "next/cache";
import { ObjectId } from "mongodb";

export async function createAccounts(prevState: any, formData: FormData) {
  await mongoDB();

  let selected = formData.getAll("selected");

  try {
    const foundEmailDocs = await Users.find<IUsers>({
      email: { $in: selected },
    });
    const foundEmails = new Set(foundEmailDocs.map((doc) => doc.email));

    const newUsers = selected
      .filter((email) => !foundEmails.has(email.toString()))
      .map((email) => ({
        email,
        linked: false,
        deleted: false,
        role: "Student",
      }));

    if (newUsers.length > 0) {
      await Users.collection.insertMany(newUsers, { ordered: false });
      revalidateTag("filteredUsers");
    } else {
      return "Nothing to create";
    }
  } catch (error) {
    console.log(error);
    return "Internal Error";
  }

  return "Success";
}

export async function deleteUser(prevState: any, formData: FormData) {
  await mongoDB();
  const remove = formData.get("remove");

  try {
    if (!remove) return "Error: Invalid Submission";

    const userDoc = await Users.findOne({ _id: remove });
    if (!userDoc) return "Error";
    userDoc.deleted = !userDoc.deleted;
    userDoc.role = userDoc.deleted ? "No" : "Student";
    await userDoc.save();

    // await Users.collection.updateOne(
    //   { _id: new ObjectId(remove.toString()) },
    //   { $set: { deleted: { $not: "$deleted" } } }
    // );

    revalidateTag("filteredUsers");
  } catch (error) {
    console.log(error);
    return "Internal Error";
  }

  return "Success";
}

export async function multiDeleteUser(prevState: any, formData: FormData) {
  await mongoDB();
  let selected = formData.getAll("remove");

  try {
    const foundUsers = await Users.find<IUsers>({
      _id: { $in: selected }, // find selected users
      role: { $nin: ["Admin", "Loops"] }, // make sure role is not in this array
    });

    if (foundUsers.length === 0) {
      return "No valid users to update";
    }

    // Check if all are currently deleted
    const allAreDeleted = foundUsers.every((user) => user.deleted);

    const ops = foundUsers.map((userDoc) => ({
      updateOne: {
        filter: { _id: userDoc._id },
        update: {
          $set: {
            deleted: !allAreDeleted,
            role: !allAreDeleted ? "No" : "Student",
          },
        },
      },
    }));

    if (ops.length > 0) {
      await Users.bulkWrite(ops);
    }
    revalidateTag("filteredUsers");
  } catch (error) {
    console.log(error);
    return "Internal Error";
  }

  return "Success";
}
