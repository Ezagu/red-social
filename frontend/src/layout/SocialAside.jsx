import React from "react";
import { Search, User } from "lucide-react";
import { UserCard } from "../components/user/UserCard";

export const SocialAside = () => {
  return (
    <aside className="text-text-primary sticky top-20 flex h-fit w-full max-w-lg flex-col gap-4">
      <header className="relative w-full">
        <Search className="absolute top-4.5 left-3" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="bg-surface focus:border-primary w-full rounded-2xl border border-transparent p-4 pl-12 text-lg focus:outline-none"
        />
      </header>
      <ul className="flex flex-col items-center gap-4">
        <UserCard />
        <UserCard />
      </ul>
    </aside>
  );
};
