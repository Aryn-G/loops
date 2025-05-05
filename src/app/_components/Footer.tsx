import Link from "next/link";

export default function Footer() {
  return (
    <footer className="font-grot font-medium max-w-sm lg:max-w-screen-xl mx-auto w-full my-8 pt-3">
      <div className="h-px w-3/12 bg-current rounded-full mx-auto"></div>
      <div className="flex lg:flex-row flex-col items-center lg:justify-center lg:items-start py-2">
        <span className="text-inherit p-3">
          &copy;
          {new Date().getFullYear()} All Rights Reserved
        </span>
        <div className="flex flex-wrap justify-center lg:justify-start">
          {[
            {
              href: "https://docs.google.com/forms/d/e/1FAIpQLSeBbGURCi6QPvpJEDIvRuXa1PZXXn-KjcC4o6xvjeGgqrrwdg/viewform",
              target: "_blank",
              title: "Suggest Loops",
            },
            {
              href: "https://www.ncssm.edu/accessibility",
              target: "_blank",
              title: "Accessibility",
            },
            {
              href: "https://www.ncssm.edu/privacy-statement",
              target: "_blank",
              title: "Privacy Poliy",
            },
            {
              href: "https://www.ncssm.edu/about/leadership/board-of-trustees/institutional-policies",
              target: "_blank",
              title: "Institutional Policy",
            },
          ].map((l) => (
            <Link
              href={l.href}
              key={l.href}
              target={l.target}
              className="hover:underline underline-offset-2 text-neutral-700 hover:text-current p-3"
            >
              {l.title}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
