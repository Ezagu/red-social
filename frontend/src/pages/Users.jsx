import React from "react";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import { UserCard } from "../components/user/UserCard.jsx";

export const Users = () => {
  return (
    <main className="text-text-primary bg-surface rounded-2xl">
      <PageHeader title="Usuarios" />
      <ul className="flex flex-col gap-2 px-2 pb-4">
        <UserCard className="border" />
        <UserCard />
        <UserCard />
        <UserCard />
      </ul>
    </main>
  );
};
