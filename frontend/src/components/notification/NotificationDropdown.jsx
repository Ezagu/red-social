import { Bell } from "lucide-react";
import { Circle } from "lucide-react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNotifications } from "../../hooks/useNotifications.jsx";
import { Notification } from "./Notification.jsx";
import { Loading } from "../ui/Loading.jsx";
import { Dropdown } from "../ui/Dropdown.jsx";

export const NotificationDropdown = () => {
  const { notifications, read, readAll, deleteOne, deleteAll, loading } =
    useNotifications();
  const { user } = useAuth();

  return (
    <Dropdown
      title="Notificaciones"
      icon={<Bell />}
      headerExtra={
        user.unreadNotificationsCount > 0 && (
          <div className="absolute -top-1 left-8 z-10 text-xs">
            <div className="relative">
              <Circle className="text-primary fill-primary absolute top-0 right-0 size-5" />
              <Circle className="text-primary absolute top-0 right-0 size-5 animate-ping" />
              <p className="left- absolute top-0.5 right-2 z-10">
                {user.unreadNotificationsCount}
              </p>
            </div>
          </div>
        )
      }
    >
      {loading ? (
        <Loading className="my-10" />
      ) : notifications.length > 0 ? (
        <div>
          <header className="flex gap-2 px-4 py-2">
            <button
              className="bg-primary hover:bg-primary-hover cursor-pointer rounded-2xl px-4 py-2 font-semibold"
              onClick={readAll}
            >
              Leer todo
            </button>
            <button
              className="bg-danger/80 hover:bg-danger cursor-pointer rounded-2xl px-4 py-2"
              onClick={deleteAll}
            >
              Borrar todo
            </button>
          </header>
          <ul className="scrollbar flex h-full max-h-[30vh] flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain p-4 pt-1">
            {notifications.map((notification) => (
              <Notification
                notification={notification}
                key={notification._id}
                read={read}
                deleteOne={deleteOne}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-text-secondary my-10 text-center text-xl tracking-wide">
          No hay notificaciones
        </p>
      )}
    </Dropdown>
  );
};
