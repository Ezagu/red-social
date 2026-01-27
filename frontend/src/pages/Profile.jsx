import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { SquarePen } from "lucide-react";
import { PageHeader } from "../components/pages/PageHeader.jsx";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";
import { url } from "../helpers/Global.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { ButtonFollowUnfollow } from "../components/ui/ButtonFollowUnfollow.jsx";
import { ListPublications } from "../components/publications/ListPublications.jsx";
import { usePaginate } from "../hooks/usePaginate.jsx";

export const Profile = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const [profile, setProfile] = useState({});
  const [loadingProfile, setLoadingProfile] = useState(true);

  const {
    items: publications,
    paginate,
    loadNextPage,
    loading: loadingPublications,
  } = usePaginate({ endpoint: `user/${id}/publications`, limit: 10 });

  useEffect(() => {
    const getProfile = async () => {
      const response = await Request("user/" + id, "GET");

      setProfile(response.user);
      setLoadingProfile(false);
    };

    getProfile();
  }, [id]);

  return (
    <main className="text-text-primary bg-surface flex flex-col items-center rounded-2xl">
      {loadingProfile ? (
        <Loading />
      ) : (
        <>
          <PageHeader title={"Perfil de " + profile.nick} />
          <header className="border-border-input w-full border-b p-4">
            <div className="ml-4 flex gap-4">
              <Avatar
                src={url + "user/avatar/" + profile.image}
                size="4xl"
                className="border-primary border"
              />
              <div className="flex min-w-0 grow flex-col">
                {user._id === profile._id ? (
                  <Link
                    to="/edit"
                    className="bg-primary hover:bg-primary-hover flex grow-0 cursor-pointer items-center gap-2 self-end rounded-2xl px-3 py-1"
                  >
                    Edit Profile
                    <SquarePen className="size-5" />
                  </Link>
                ) : (
                  <ButtonFollowUnfollow
                    profile={profile}
                    setProfile={setProfile}
                    className="grow-0 self-end"
                  />
                )}
                <div className="mt-2 flex items-center gap-2">
                  <h1 className="truncate text-5xl font-semibold">
                    {profile.nick}
                  </h1>
                  {profile.isFollower && user._id !== profile._id && (
                    <span className="bg-elevated text-md shrink-0 rounded-2xl px-1.5 py-0.5">
                      Te sigue
                    </span>
                  )}
                </div>
                <h2 className="text-text-secondary mt-1 truncate text-xl">
                  {profile.fullName}
                </h2>
                <p className="mt-2 line-clamp-3 grow text-xl">{profile.bio}</p>
              </div>
            </div>
            <div className="mt-6 grid grid-cols-3">
              <Link className="border-border-input border-r">
                <h3 className="text-text-secondary text-center text-xl">
                  Publicaciones
                </h3>
                <p className="text-center text-3xl font-bold">
                  {profile.publicationsCount}
                </p>
              </Link>
              <Link
                to={"/users?mode=followers&id=" + profile._id}
                className="border-border-input border-r"
              >
                <h3 className="text-text-secondary text-center text-xl">
                  Seguidores
                </h3>
                <p className="text-center text-3xl font-bold">
                  {profile.followersCount}
                </p>
              </Link>
              <Link to={"/users?mode=following&id=" + profile._id}>
                <h3 className="text-text-secondary text-center text-xl">
                  Seguidos
                </h3>
                <p className="text-center text-3xl font-bold">
                  {profile.followingCount}
                </p>
              </Link>
            </div>
          </header>
          {loadingPublications ? (
            <Loading />
          ) : (
            <ListPublications
              publications={publications}
              publicationsInfo={paginate}
              loadNextPage={loadNextPage}
            />
          )}
        </>
      )}
    </main>
  );
};
