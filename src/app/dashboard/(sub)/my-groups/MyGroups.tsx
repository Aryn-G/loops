import { Session } from "next-auth";

import { countUsersInGroup, getUserGroups } from "@/app/_db/queries/groups";

export default async function MyGroups({ session }: { session: Session }) {
  const userGroups = await getUserGroups(session.userId);

  return (
    <div className="w-full flex flex-col gap-2 my-3">
      <div className="divide-y divide-black flex flex-col md:gap-2 items-center">
        {userGroups.length === 0 ? (
          <p className="">You aren{"'"}t in any student groups.</p>
        ) : (
          userGroups.map((group) => <Group group={group} key={group._id} />)
        )}
      </div>
    </div>
  );
}

const Group = async ({
  group,
}: {
  group: Awaited<ReturnType<typeof getUserGroups>>[number];
}) => {
  return (
    <div className="py-3 flex flex-row gap-2 w-full items-center justify-center">
      <div className="flex gap-2 flex-1 w-full items-center">
        <div className="flex flex-col flex-1">
          <p
            className={
              (group.deleted && "text-rose-700") +
              " text-base md:text-lg font-bold"
            }
          >
            {group.deleted && "(Deleted) "}
            {group.name}
          </p>
          {/* <p className="text-base">{group.users.join(", ")}</p> */}
          <p className="text-base">
            Contains {group.count} {group.count === 1 ? "Person" : "People"}
          </p>
        </div>
      </div>
    </div>
  );
};
