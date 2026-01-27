import React, { useState } from "react";
import Request from "../helpers/Request";

export const useLike = ({ targetType, target }) => {
  const [liked, setLiked] = useState(target.liked);
  const [likesCount, setLikesCount] = useState(target.likesCount);

  const toggleLike = async () => {
    if (liked) {
      const response = await Request(`like/${target._id}`, "DELETE", true, {
        targetType,
      });
      if (response.status === "success") {
        setLikesCount((prev) => prev - 1);
        setLiked(false);
      }
    } else {
      const response = await Request(`like/${target._id}`, "POST", true, {
        targetType,
      });
      if (response.status === "success") {
        setLikesCount((prev) => prev + 1);
        setLiked(true);
      }
    }
  };

  return {
    liked,
    likesCount,
    toggleLike,
  };
};
