import { Bell, Pen } from "lucide-react";
import { useAuth } from "../hooks/useAuth.jsx";
import { ProfileCard } from "../components/user/ProfileCard.jsx";
import { CreatePublication } from "../components/publications/CreatePublication.jsx";
import { Dropdown } from "../components/ui/Dropdown.jsx";
import { ListNotifications } from "../components/notification/ListNotifications.jsx";
import { Badge } from "../components/ui/Badge.jsx";

export const ProfileAside = () => {
  const { user } = useAuth();

  return (
    <aside className="sticky top-24 hidden h-fit w-full flex-col gap-4 justify-self-end xl:flex">
      <ProfileCard />
      <Dropdown title="Publicar" icon={<Pen size={20} />} initialState={true}>
        <CreatePublication />
      </Dropdown>
      <Dropdown
        title="Notificaciones"
        icon={<Bell size={20} />}
        badge={
          user.unreadNotificationsCount > 0 && (
            <Badge>{user.unreadNotificationsCount}</Badge>
          )
        }
      >
        <ListNotifications fullHeight={false} />
      </Dropdown>
    </aside>
  );
};
