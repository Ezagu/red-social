import React, { useEffect, useState } from "react";
import { Global } from "../../helpers/Global";
import { UserList } from "../user/UserList";
import { useParams } from "react-router-dom";
import GetProfile from "../../helpers/GetProfile";

export const Following = () => {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [following, setFollowing] = useState([]);
  const [more, setMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({});

  const params = useParams();

  useEffect(() => {
    getUsers();
    GetProfile(params.userId, setUserProfile);
  }, [page]);

  const getUsers = async () => {
    setLoading(true);

    // Sacar user id de la url
    const userId = params.userId;

    // Peticion para sacar usuarios
    const req = await fetch(Global.url + "follow/following/" + userId + '/' + page, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: localStorage.getItem("token"),
      },
    });

    const data = await req.json();
    const {follows, user_following, hasNextPage, status} = data;

    if(status !== 'success') {
      setLoading(false);
      return;
    }

    // Recorrer y limpiar follows para quedarme con followed
    let cleanUsers = follows.map(follow => follow.followed);

    setUsers((prevUsers) => [...prevUsers, ...cleanUsers]);
    setFollowing(user_following);
    setMore(hasNextPage);

    setLoading(false);
  };

  return (
    <>
      <header className="content__header">
        <h1 className="content__title">Usuarios que sigue {userProfile.name + ' ' + userProfile.surname}</h1>
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
