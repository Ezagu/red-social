import React from "react";

export const Footer = () => {
  return (
    <footer className="flex h-10 w-full items-center justify-center border-t border-gray-800 bg-gray-950 text-sm text-slate-50/70">
      <p>
        Creado con 💖 por{" "}
        <a
          className="transition-all hover:border-b hover:text-amber-50"
          href="https://ezagudev.vercel.app"
          target="blank"
        >
          Ezagu
        </a>{" "}
        -{" "}
        <a
          className="transition-all hover:border-b hover:text-amber-50"
          href="https://github.com/Ezagu/red-social"
          target="blank"
        >
          Github
        </a>{" "}
      </p>
    </footer>
  );
};
