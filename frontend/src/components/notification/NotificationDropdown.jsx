import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth.jsx";
import { Bell } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Circle } from "lucide-react";
import { Notification } from "./Notification.jsx";
import { useNotifications } from "../../hooks/useNotifications.jsx";
import { Loading } from "../ui/Loading.jsx";

export const NotificationDropdown = () => {
  const { user } = useAuth();
  const [show, setShow] = useState(false);

  const { notifications, read, readAll, deleteOne, deleteAll, loading } =
    useNotifications();

  return (
    <div className="text-text-primary bg-surface relative rounded-2xl">
      <button
        className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => setShow((prev) => !prev)}
      >
        {user.unreadNotificationsCount > 0 && (
          <>
            <span className="absolute top-2.5 left-8.5 z-10 text-xs">
              {user.unreadNotificationsCount}
            </span>
            <Circle className="text-primary fill-primary absolute top-2 left-7 size-5" />
            <Circle className="text-primary absolute top-2 left-7 size-5 animate-ping" />
          </>
        )}
        <Bell />
        <h1>Notificaciones</h1>
        <ChevronUp
          className={`absolute right-4 transition-transform duration-300 ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {loading ? (
        <Loading className="my-10" />
      ) : (
        show &&
        (notifications.length > 0 ? (
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
        ))
      )}
    </div>
  );
};
