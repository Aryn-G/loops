import { refreshAction } from "./Refresh.action";

export default function Refresh({ tag }: { tag: string | string[] }) {
  return (
    <form action={refreshAction}>
      {typeof tag === "string" ? (
        <input name="tag" id="tag" value={tag} readOnly className="hidden" />
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
      <button className="bg-white ring-1 ring-black shadow-brutal-sm rounded-lg px-5 py-2 font-bold">
        Refresh
      </button>
    </form>
  );
}
