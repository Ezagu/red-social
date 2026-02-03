import { Button } from "./Button";

export const ButtonIconRight = ({ icon, children, ...props }) => {
  const { className, ...remainingProps } = props;

  return (
    <Button
      className={`flex cursor-pointer items-center gap-2 ${className}`}
      {...remainingProps}
    >
      {children}
      <div className="size-5">{icon}</div>
    </Button>
  );
};
