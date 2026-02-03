import { RedButton } from "./RedButton";

export const RedButtonIconRight = ({ icon, children, ...props }) => {
  const { classname, ...remainingProps } = props;
  return (
    <RedButton
      className={`flex cursor-pointer items-center gap-2 ${classname}`}
      {...remainingProps}
    >
      {children}
      <div className="size-5">{icon}</div>
    </RedButton>
  );
};
