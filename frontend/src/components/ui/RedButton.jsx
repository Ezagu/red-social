export const RedButton = ({
  children,
  onClick,
  size = "md",
  type = "button",
  className = "",
}) => {
  return (
    <button
      onClick={onClick}
      className={`bg-danger/70 hover:bg-danger cursor-pointer rounded-2xl font-semibold ${size === "md" ? "text-md px-4 py-2" : "px-2 py-1 text-sm"} ${className}`}
      type={type}
    >
      {children}
    </button>
  );
};
