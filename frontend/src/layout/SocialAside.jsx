import { SearchUsers } from "../components/user/SearchUsers.jsx";

export const SocialAside = () => {
  return (
    <aside className="text-text-primary sticky top-24 hidden h-fit w-full flex-col gap-4 xl:flex">
      <SearchUsers />
    </aside>
  );
};
