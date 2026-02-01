export const TabSelector = ({
  sections = [],
  section = sections[0],
  setSection,
}) => {
  return (
    <div className="flex">
      {sections.map((sec) => (
        <button
          key={sec}
          className={`w-full cursor-pointer border-b p-2 text-lg font-semibold transition-all ${
            sec === section
              ? "text-text-primary bg-primary border-primary"
              : "hover:bg-elevated text-text-muted hover:text-text-secondary"
          } `}
          onClick={() => setSection(sec)}
        >
          {sec}
        </button>
      ))}
    </div>
  );
};
