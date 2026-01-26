import React, { useEffect, useState } from "react";
import Request from "../helpers/Request";
import { useAuth } from "./useAuth";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { setUser } = useAuth();

  useEffect(() => {
    const loadNotifications = async () => {
      const response = await Request("user/notifications");
      setNotifications(response.notifications);
    };

    loadNotifications();
  }, []);

  const read = async (id) => {
    const response = await Request(`notification/${id}/read`, "PATCH");
    if (response.status === "success") {
      // Marcar como leída la notificacion en la lista de notificaciones
      setNotifications((prev) =>
        prev.map((noti) => {
          if (noti._id === id) {
            noti.read = true;
          }
          return noti;
        }),
      );

      // Actualizar numero de notificaciones no leidas del usuario
      setUser((prev) => ({
        ...prev,
        unreadNotificationsCount: prev.unreadNotificationsCount - 1,
      }));
    }
  };

  const readAll = async () => {
    const response = await Request("notification/read-all", "PATCH");
    if (response.status === "success") {
      setNotifications((prev) => prev.map((noti) => ({ ...noti, read: true })));
      setUser((prev) => ({
        ...prev,
        unreadNotificationsCount: 0,
      }));
    }
  };

  const deleteOne = async (id) => {
    const response = await Request("notification/" + id, "DELETE");
    if (response.status === "success") {
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== id),
      );
      if (!response.notification.read) {
        setUser((prev) => ({
          ...prev,
          unreadNotificationsCount: prev.unreadNotificationsCount - 1,
        }));
      }
    }
  };

  const deleteAll = async () => {
    const response = await Request("notification/remove-all", "DELETE");
    if (response.status === "success") {
      setNotifications([]);
      setUser((prev) => ({
        ...prev,
        unreadNotificationsCount: 0,
      }));
    }
  };

  return {
    notifications,
    read,
    readAll,
    deleteOne,
    deleteAll,
  };
};
