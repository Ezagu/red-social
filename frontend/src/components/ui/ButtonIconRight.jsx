import { Button } from "./Button";

export const ButtonIconRight = ({
  icon,
  children,
  onClick,
  size = "sm",
  type = "button",
}) => {
  return (
    <Button
      onClick={onClick}
      size={size}
      type={type}
      className="flex cursor-pointer items-center gap-2"
    >
      {children}
      <div className="size-5">{icon}</div>
    </Button>
  );
};
