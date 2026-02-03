import { UserRoundX } from "lucide-react";
import { useFollow } from "../../hooks/useFollow";
import { RedButtonIconRight } from "./RedButtonIconRight";

export const ButtonUnfollow = ({ profile, setProfile, ...props }) => {
  const { unfollow } = useFollow({ profile, setProfile });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    unfollow();
  };

  return (
    <RedButtonIconRight
      onClick={handleClick}
      icon={<UserRoundX className="size-5" />}
      {...props}
    >
      Dejar de seguir
    </RedButtonIconRight>
  );
};
