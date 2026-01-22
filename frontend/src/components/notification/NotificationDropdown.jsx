import React, { useState } from "react";
import { Bell } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Circle } from "lucide-react";
import { Notification } from "./Notification.jsx";

export const NotificationDropdown = () => {
  const [show, setShow] = useState(false);
  const [unreadNotification, setUnreadNotification] = useState(true);

  return (
    <div className="text-text-primary bg-surface relative rounded-2xl">
      <button
        className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => setShow((prev) => !prev)}
      >
        {unreadNotification && (
          <>
            <span className="absolute top-2.5 left-8.5 z-10 text-xs">4</span>
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
      {show && (
        <ul className="flex flex-col gap-2 p-4 pt-1">
          <Notification />
        </ul>
      )}
    </div>
  );
};
