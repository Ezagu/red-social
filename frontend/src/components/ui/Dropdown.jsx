import { useState } from "react";
import { ChevronUp } from "lucide-react";

export const Dropdown = ({
  children,
  title,
  icon,
  initialState = false,
  headerExtra,
}) => {
  const [show, setShow] = useState(initialState);

  return (
    <section className="text-text-primary bg-surface relative rounded-2xl">
      <header>
        <button
          className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
          onClick={() => {
            setShow((prev) => !prev);
          }}
        >
          <div className="relative">
            {icon}
            {headerExtra}
          </div>

          <h1>{title}</h1>
          <ChevronUp
            className={`absolute right-4 transition-transform duration-300 ${
              show ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </header>
      {show && children}
    </section>
  );
};
