import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { Avatar } from "../components/ui/Avatar";
import { Pen, SquarePen } from "lucide-react";
import { PageWithHeader } from "../components/pages/PageWithHeader.jsx";
import Request from "../helpers/Request.jsx";
import { Loading } from "../components/ui/Loading.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { ListPublications } from "../components/publications/ListPublications.jsx";
import { usePaginate } from "../hooks/usePaginate.jsx";
import { ButtonUnfollow } from "../components/ui/ButtonUnfollow.jsx";
import { ButtonFollow } from "../components/ui/ButtonFollow.jsx";
import { useProfile } from "../hooks/useProfile.jsx";
import { useMyPublications } from "../hooks/useMyPublications.jsx";
import { CreatePublication } from "../components/publications/CreatePublication.jsx";

export const Profile = () => {
  const { id } = useParams();

  const { user } = useAuth();

  const [loadingProfile, setLoadingProfile] = useState(true);

  const { profile, setProfile } = useProfile();
  const { setMyPublications, myPublications } = useMyPublications();

  const {
    items: publications,
    paginate,
    loadNextPage,
    loading: loadingPublications,
    removeItem,
  } = usePaginate({ endpoint: `user/${id}/publications`, limit: 10 });

  useEffect(() => {
    const getProfile = async () => {
      if (profile?._id === id) {
        setLoadingProfile(false);
        return;
      }
      const response = await Request("user/" + id, "GET");

      setProfile(response.user);
      setLoadingProfile(false);
    };

    getProfile();
  }, [id]);

  useEffect(() => {
    if (publications.length === 0) return;

    if (id === user._id) {
      setMyPublications(publications);
    }
  }, [publications]);

  return (
    <PageWithHeader title={"Perfil de " + profile.nick}>
      {loadingProfile ? (
        <Loading className="my-10" />
      ) : (
        <>
          <header className="border-border-input w-full border-b p-4">
            <div className="ml-4 flex gap-4">
              <Avatar
                src={profile.image}
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
                  <div className="self-end">
                    {profile.isFollowed ? (
                      <ButtonUnfollow
                        profile={profile}
                        setProfile={setProfile}
                      />
                    ) : (
                      <ButtonFollow profile={profile} setProfile={setProfile} />
                    )}
                  </div>
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
          {profile._id.toString() === user._id.toString() && (
            <div className="border-border-input border-b xl:hidden">
              <div className="flex items-center gap-4 p-4 pb-0">
                <Pen size={22} />
                <h2 className="text-2xl font-semibold">Crea una publicación</h2>
              </div>
              <CreatePublication />
            </div>
          )}
          {loadingPublications ? (
            <Loading className="my-5" />
          ) : (
            <ListPublications
              publications={
                id.toString() === user._id.toString()
                  ? myPublications
                  : publications
              }
              paginate={paginate}
              loadNextPage={loadNextPage}
              removeItem={removeItem}
            />
          )}
        </>
      )}
    </PageWithHeader>
  );
};
