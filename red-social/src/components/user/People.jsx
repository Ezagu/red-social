import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "./UserList";

export const People = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState([]);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, [page]);

  const getUsers = async () => {
    setLoading(true);
    // Peticion para sacar usuarios
    const req = await fetch(Global.url + "user/list/" + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();

    // Crear un estado para poder listarlos
    if (data.users && data.status === "success") {
      setUsers((prevUsers) => [...prevUsers, ...data.users]);
      setFollowing(data.user_following);
      setMore(data.hasNextPage);

      setLoading(false);
    }
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Gente</h1>
      </header>

      <UserList 
        users={users} 
        following={following}
        setFollowing={setFollowing}
        page={page}
        setPage={setPage}
        more={more}
        loading={loading}
      />

      

      <br />
    </>
  );
};
