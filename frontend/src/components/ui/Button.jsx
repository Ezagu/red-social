export const Button = ({ children, ...props }) => {
  const { className, size, ...remainingProps } = props;

  return (
    <button
      className={`bg-primary hover:bg-primary-hover text-text-primary cursor-pointer rounded-2xl font-semibold ${className} ${size === "sm" ? "px-2 py-1 text-sm" : "text-md px-4 py-2"}`}
      {...remainingProps}
    >
      {children}
    </button>
  );
};
