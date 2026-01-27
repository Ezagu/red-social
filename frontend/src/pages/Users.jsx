import React, { useEffect, useState } from "react";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import { UserCard } from "../components/user/UserCard.jsx";
import { useSearchParams } from "react-router";
import Request from "../helpers/Request.jsx";
import { usePaginate } from "../hooks/usePaginate.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const Users = () => {
  const [params] = useSearchParams();

  const mode = params.get("mode");
  const id = params.get("id");

  const [profile, setProfile] = useState({});

  const {
    items: users,
    paginate,
    loadNextPage,
    loading,
  } = usePaginate({
    endpoint: `${mode === "followers" ? `user/${id}/followers` : `user/${id}/following`}`,
    limit: 20,
  });

  useEffect(() => {
    const getProfile = async () => {
      const response = await Request("user/" + id);
      setProfile(response.user);
    };

    getProfile();
  }, [mode, id]);

  return (
    <main className="text-text-primary bg-surface rounded-2xl">
      {loading ? (
        <Loading />
      ) : (
        <>
          <PageHeader
            title={`Usuarios que ${mode === "followers" ? "siguen a" : "sigue"} ${profile?.nick}`}
          />
          <ul className="flex flex-col gap-2 px-2 pb-4">
            {users.map((user) => (
              <UserCard user={user} key={user._id} />
            ))}
          </ul>
          {paginate.hasNextPage && (
            <button
              className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 block w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
              onClick={loadNextPage}
            >
              Ver más
            </button>
          )}
        </>
      )}
    </main>
  );
};
