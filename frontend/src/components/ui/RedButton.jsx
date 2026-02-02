export const RedButton = ({ children, ...props }) => {
  const { className, ...remainingProps } = props;
  return (
    <button
      className={`bg-danger/70 hover:bg-danger text-text-primary cursor-pointer rounded-2xl px-4 py-2 font-semibold ${className}`}
      {...remainingProps}
    >
      {children}
    </button>
  );
};
