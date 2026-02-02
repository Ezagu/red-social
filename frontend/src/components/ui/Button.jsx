export const Button = ({ children, ...props }) => {
  const { className, ...remainingProps } = props;

  return (
    <button
      className={`bg-primary hover:bg-primary-hover text-text-primary cursor-pointer rounded-2xl px-4 py-2 font-semibold ${className}`}
      {...remainingProps}
    >
      {children}
    </button>
  );
};
