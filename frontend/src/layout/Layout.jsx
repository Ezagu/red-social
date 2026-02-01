import { Outlet, useNavigate } from "react-router";
import { useAuth } from "../hooks/useAuth.jsx";
import { Header } from "./Header.jsx";
import { SocialAside } from "./SocialAside.jsx";
import { ProfileAside } from "./ProfileAside.jsx";
import { Footer } from "./Footer.jsx";
import { Loading } from "../components/ui/Loading.jsx";

export const Layout = () => {
  const { user, loading } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="m-auto grid w-full flex-1 grid-cols-[minmax(0,650px)] justify-center gap-4 p-4 xl:grid-cols-[minmax(360px,450px)_minmax(500px,650px)_minmax(360px,450px)]">
        {loading ? (
          <Loading className="self-center xl:col-span-3" />
        ) : user?._id ? (
          <>
            <ProfileAside />
            <Outlet />
            <SocialAside />
          </>
        ) : (
          navigate("/login")
        )}
      </main>
      <Footer />
    </div>
  );
};
