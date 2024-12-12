import { ArrowPathRoundedSquareIcon } from "@heroicons/react/16/solid";
import { refreshAction } from "./Refresh.action";

export default function Refresh({
  tag,
  path,
}: {
  tag?: string | string[];
  path?: string;
}) {
  return (
    <form action={refreshAction}>
      {tag !== undefined && (
        <>
          {typeof tag === "string" ? (
            <input
              name="tag"
              id="tag"
              value={tag}
              readOnly
              className="hidden"
            />
          ) : (
            tag.map((t) => (
              <input
                key={t}
                name="tag"
                id="tag"
                value={t}
                readOnly
                className="hidden"
              />
            ))
          )}
        </>
      )}
      {path !== undefined && (
        <input name="path" id="path" value={path} readOnly className="hidden" />
      )}
      <button className="flex items-center justify-center gap-2 p-2">
        Sync <ArrowPathRoundedSquareIcon className="size-4" />
      </button>
    </form>
  );
}
