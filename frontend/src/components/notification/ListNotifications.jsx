import { useNotifications } from "../../hooks/useNotifications";
import { Notification } from "./Notification";
import { Loading } from "../ui/Loading";

export const ListNotifications = ({ fullHeight = true }) => {
  const { notifications, read, readAll, deleteOne, deleteAll, loading } =
    useNotifications();

  if (loading) {
    return <Loading className="my-10" />;
  }

  return (
    <>
      {notifications.length > 0 ? (
        <div>
          <header className="flex gap-2 p-4">
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
          <ul
            className={`scrollbar flex h-full max-h-[30vh] flex-col gap-2 overflow-x-hidden overflow-y-auto p-4 pt-1 ${fullHeight ? "max-h-full" : "max-h-[30vh] overscroll-contain"}`}
          >
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
    </>
  );
};
