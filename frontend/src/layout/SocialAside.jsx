import React, { useEffect, useState } from "react";
import { Search, User } from "lucide-react";
import { UserCard } from "../components/user/UserCard";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const SocialAside = () => {
  const [usersInfo, setUsersInfo] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const searchUsers = async () => {
      if (search === "") return;

      const response = await Request(`user/users?search=${search}`);

      setUsersInfo(response);
      setUsers(response.items);

      setLoading(false);
    };

    const timeout = setTimeout(() => {
      searchUsers();
    }, 400);

    //Cuando retornas, se ejecuta la proxima vez que se ejecuta el useEffect (función cleanup)
    return () => clearTimeout(timeout);
  }, [search]);

  const loadNextPage = async () => {
    const response = await Request(
      `user/users?search=${search}&page=${Number(usersInfo.page) + 1}`,
    );
    setUsersInfo(response);
    setUsers((prev) => [...prev, ...response.items]);
  };

  return (
    <aside className="text-text-primary sticky top-24 hidden h-fit w-full flex-col gap-4 xl:flex">
      <header className="relative w-full">
        <Search className="absolute top-4.5 left-3" />
        <input
          type="text"
          placeholder="Buscar usuarios..."
          className="bg-surface focus:border-primary w-full rounded-2xl border border-transparent p-4 pl-12 text-lg focus:outline-none"
          onChange={(e) => {
            setUsers([]);
            setUsersInfo({});
            setLoading(true);
            setSearch(e.target.value);
          }}
        />
      </header>
      <ul
        className={`scrollbar-dark flex max-h-[75vh] flex-col items-center gap-4 overscroll-contain ${!loading && "overflow-y-auto"}`}
      >
        {search === "" ? (
          ""
        ) : loading ? (
          <Loading />
        ) : users.length === 0 ? (
          <div>No se encontraron usuarios</div>
        ) : (
          users.map((user) => <UserCard user={user} key={user._id} />)
        )}
        {usersInfo.hasNextPage && (
          <button
            className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
            onClick={loadNextPage}
          >
            Ver más
          </button>
        )}
      </ul>
    </aside>
  );
};
