import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import { UserCard } from "../components/user/UserCard.jsx";
import { useSearchParams } from "react-router";
import Request from "../helpers/Request.jsx";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [usersInfo, setUsersInfo] = useState({});
  const [params] = useSearchParams();
  const [profile, setProfile] = useState({});

  const mode = params.get("mode");
  const id = params.get("id");

  useEffect(() => {
    const getUsers = async () => {
      const endpoint =
        mode === "followers" ? `user/${id}/followers` : `user/${id}/following`;
      const response = await Request(endpoint);
      setUsers(response.users);
      setUsersInfo(response);
    };

    const getProfile = async () => {
      const response = await Request("user/" + id);
      setProfile(response.user);
    };

    getProfile();
    getUsers();
  }, [mode, id]);

  const loadNextPage = async () => {
    const endpoint =
      mode === "followers"
        ? `user/${id}/followers?page=${Number(usersInfo.page) + 1}`
        : `user/${id}/following?page=${Number(usersInfo.page) + 1}`;
    const response = await Request(endpoint);
    setUsersInfo(response);
    setUsers((prev) => [...prev, ...response.users]);
  };

  return (
    <main className="text-text-primary bg-surface rounded-2xl">
      <PageHeader
        title={`Usuarios que ${mode === "followers" ? "siguen a" : "sigue"} ${profile?.nick}`}
      />
      <ul className="flex flex-col gap-2 px-2 pb-4">
        {users.map((user) => (
          <UserCard user={user} key={user._id} />
        ))}
      </ul>
      {usersInfo.hasNextPage && (
        <button
          className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 block w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
          onClick={loadNextPage}
        >
          Ver más
        </button>
      )}
    </main>
  );
};
