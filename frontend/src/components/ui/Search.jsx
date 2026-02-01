import { Search as SearchIcon } from "lucide-react";

export const Search = ({ setSearch, border = false }) => {
  return (
    <div
      className={`${border ? "border-border-input focus-within:border-primary" : "focus-within:border-primary border-transparent"} relative w-full rounded-2xl border`}
    >
      <SearchIcon className="absolute top-4.5 left-3" />
      <input
        type="text"
        placeholder="Buscar usuarios..."
        className="bg-surface w-full rounded-2xl border border-transparent p-4 pl-12 text-lg focus:outline-none"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
    </div>
  );
};
