import Request from "./Request";

export const handleLike = async (id, type, liked, setLiked, target) => {
  const response = await Request(
    `like/${id}`,
    liked ? "DELETE" : "POST",
    true,
    { targetType: type },
  );

  if (response.status === "success") {
    liked ? target.likesCount-- : target.likesCount++;
    setLiked((prev) => !prev);
  } else {
    return null;
  }
};
