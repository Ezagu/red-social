import { UserRoundPlus } from "lucide-react";
import { useFollow } from "../../hooks/useFollow";
import { ButtonIconRight } from "./ButtonIconRight";

export const ButtonFollow = ({ profile, setProfile, ...props }) => {
  const { follow } = useFollow({ profile, setProfile });

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    follow();
  };

  return (
    <ButtonIconRight
      icon={<UserRoundPlus className="size-5" />}
      onClick={handleClick}
      {...props}
    >
      Seguir
    </ButtonIconRight>
  );
};
