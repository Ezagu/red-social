import React from "react";
import { ProfileCard } from "../components/user/ProfileCard.jsx";
import { CreatePublication } from "../components/publications/CreatePublication.jsx";
import { NotificationDropdown } from "../components/notification/NotificationDropdown.jsx";

export const ProfileAside = () => {
  return (
    <aside className="flex w-full max-w-lg flex-col gap-4 justify-self-end">
      <ProfileCard />
      <CreatePublication />
      <NotificationDropdown />
    </aside>
  );
};
