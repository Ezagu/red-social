import { useState } from "react";
import { ChevronUp } from "lucide-react";

export const Dropdown = ({
  children,
  title,
  icon,
  initialState = false,
  badge = null,
}) => {
  const [show, setShow] = useState(initialState);

  return (
    <section className="text-text-primary bg-surface overflow-hidden rounded-2xl">
      <button
        className="hover:bg-elevated flex h-13 w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => {
          setShow((prev) => !prev);
        }}
      >
        <div className="text-text-secondary">{icon}</div>

        <h1>{title}</h1>

        <div className="ml-auto">{badge}</div>

        <ChevronUp
          className={`transition-transform duration-300 ${!badge && "ml-auto"} ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {show && children}
    </section>
  );
};
