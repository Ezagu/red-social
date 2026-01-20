import React, { useState } from "react";
import { Bell } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Dot } from "lucide-react";
import { ListNotifications } from "./ListNotifications";

export const NotificationDropdown = () => {
  const [show, setShow] = useState(false);
  const [unreadNotification, setUnreadNotification] = useState(false);

  return (
    <div className="text-text-primary bg-surface relative rounded-2xl">
      <button
        className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => setShow((prev) => !prev)}
      >
        {unreadNotification && (
          <>
            <Dot className="text-primary absolute -top-0.5 left-2 size-12" />
            <Dot className="text-primary absolute -top-0.5 left-2 size-12 animate-ping" />
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
        <ListNotifications
          type="Comment"
          notifications={[
            {
              _id: "333",
              targetType: "Comment",
              fromUser: {
                image: "src/assets/kiara.jpg",
                nick: "dkiara03",
              },
            },
            {
              _id: "111",
              targetType: "Like",
              fromUser: {
                image: "src/assets/kiara.jpg",
                nick: "dkiara03",
              },
            },
            {
              _id: "123",
              targetType: "Follow",
              read: true,
              fromUser: {
                image: "src/assets/kiara.jpg",
                nick: "dkiara03",
              },
            },
          ]}
        />
      )}
    </div>
  );
};
