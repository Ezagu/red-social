import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Request from "../helpers/Request.jsx";
import { usePaginate } from "../hooks/usePaginate.jsx";
import { Loading } from "../components/ui/Loading.jsx";
import { PageWithHeader } from "../components/pages/PageWithHeader.jsx";
import { ListUsers } from "../components/user/ListUsers.jsx";

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

  if (loading) {
    return <Loading className="my-10" />;
  }

  return (
    <PageWithHeader
      title={`Usuarios que ${mode === "followers" ? "siguen a" : "sigue"} ${profile?.nick}`}
    >
      <ListUsers users={users} />
      {paginate.hasNextPage && (
        <button
          className="bg-primary hover:bg-primary-hover text-text-primary m-auto my-4 block w-1/2 cursor-pointer rounded-2xl py-2 font-semibold"
          onClick={loadNextPage}
        >
          Ver más
        </button>
      )}
    </PageWithHeader>
  );
};
