import React, { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { UserCard } from "../components/user/UserCard";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const SocialAside = () => {
  const [usersInfo, setUsersInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      searchUsers();
    }, 400);

    const searchUsers = async () => {
      if (search === "") return;

      setLoading(true);

      const response = await Request(
        `user/users?page=${page}&search=${search}`,
        "GET",
      );

      setUsersInfo(response);
      setUsers((prev) =>
        page === 1 ? response.users : [...prev, ...response.users],
      );

      setLoading(false);
    };

    {
      /*Cuando retornas, se ejecuta la proxima vez que se ejecuta el useEffect (función cleanup) */
    }
    return () => clearTimeout(timeout);
  }, [page, search]);

  return (
    <aside className="text-text-primary sticky top-20 flex h-fit w-full max-w-lg flex-col gap-4">
      <header className="relative w-full">
        <Search className="absolute top-4.5 left-3" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="bg-surface focus:border-primary w-full rounded-2xl border border-transparent p-4 pl-12 text-lg focus:outline-none"
          onChange={(e) => {
            setUsers([]);
            setUsersInfo({});
            setPage(1);
            setSearch(e.target.value);
          }}
        />
      </header>
      <ul className="flex flex-col items-center gap-4">
        {loading ? (
          <Loading />
        ) : (
          users.map((user) => <UserCard user={user} key={user._id} />)
        )}
      </ul>
      {usersInfo.hasNextPage && (
        <button
          className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
          onClick={() => setPage((prev) => prev + 1)}
        >
          Ver más
        </button>
      )}
    </aside>
  );
};
