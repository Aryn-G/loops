import { auth } from "@/auth";
import { forbidden, redirect, unauthorized } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import AryanPNG from "./Aryan.png";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

export const metadata: Metadata = {
  title: "Loops • Authors",
};

export type Author = {
  name: string;
  short: string;
  picture: StaticImport | "string";
  bio: string;
};

export default async function Page() {
  const session = await auth();
  if (!session) return unauthorized();

  const authors: Author[] = [
    {
      picture: AryanPNG,
      name: "Aryan Gera '25",
      short: "Founder",
      bio: "Hi, I'm Aryan (NCSSM-M '25). After noticing how clunky NCSSM's loops spreadsheet system was, I started developing L∞ps in my senior-year CS4900 Advanced Computer Science Topics class. I kept polishing the application as a CS TA and wrapped it up right before graduation. Unfortunately, I didn't get to use L∞ps myself, but I am glad that future NCSSM-M students and staff will!",
    },
  ];

  return (
    <div className="pt-20">
      <h1 className="text-center font-black text-xl md:text-3xl">Authors</h1>
      <div className="mt-10 flex flex-col gap-10 items-center justify-center">
        {authors.map((author, i) => (
          <div
            key={author.name}
            className={`flex ${
              i % 2 === 0
                ? "md:flex-row md:text-start"
                : "md:flex-row-reverse md:text-end"
            } justify-center items-center flex-col gap-10 text-center`}
          >
            <Image
              alt={"Image of " + author.name}
              src={author.picture}
              className="object-cover aspect-[5/7] brutal-xl p-0 select-none pointer-events-none"
            />
            <div className="flex flex-col gap-1 max-w-[40ch]">
              <h2 className="font-black text-xl md:text-2xl">{author.name}</h2>
              <p className="font-bold text-lg md:text-xl mb-4">
                {author.short}
              </p>
              <p>{author.bio}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
