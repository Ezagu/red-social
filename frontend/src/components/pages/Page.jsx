export const Page = ({ children, className }) => {
  return (
    <main
      className={`bg-surface text-text-primary overflow-hidden rounded-2xl ${className}`}
    >
      {children}
    </main>
  );
};
