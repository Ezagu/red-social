import { RedButton } from "./RedButton";

export const RedButtonIconRight = ({
  icon,
  children,
  onClick,
  size = "sm",
  type = "button",
}) => {
  return (
    <RedButton
      onClick={onClick}
      size={size}
      type={type}
      className="flex cursor-pointer items-center gap-2"
    >
      {children}
      <div className="size-5">{icon}</div>
    </RedButton>
  );
};
