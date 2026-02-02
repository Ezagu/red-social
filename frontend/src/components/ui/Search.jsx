import { Search as SearchIcon } from "lucide-react";

export const Search = ({ setSearch, border = false }) => {
  return (
    <div
      className={`${border ? "border-border-input focus-within:border-primary" : "focus-within:border-primary border-transparent"} relative w-full rounded-2xl border`}
    >
      <SearchIcon className="absolute top-1/2 left-3 -translate-y-1/2" />
      <input
        type="text"
        placeholder="Buscar usuarios..."
        className="bg-surface w-full rounded-2xl border border-transparent p-4 pl-14 text-lg focus:outline-none"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};
