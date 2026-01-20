import React, { useState } from "react";
import { ChevronUp } from "lucide-react";
import { Pen } from "lucide-react";
import { Alert } from "../ui/Alert.jsx";

export const CreatePublication = () => {
  const [show, setShow] = useState(true);
  const [result, setResult] = useState(null);

  return (
    <div className="text-text-primary bg-surface relative rounded-2xl">
      <button
        className="flex w-full cursor-pointer items-center gap-2 p-4 text-xl font-semibold"
        onClick={() => {
          console.log(show);
          setShow((prev) => !prev);
        }}
      >
        <Pen />
        <h1>Publicar</h1>
        <ChevronUp
          className={`absolute right-4 transition-transform duration-300 ${
            show ? "rotate-0" : "rotate-180"
          }`}
        />
      </button>
      {show && (
        <form className="flex flex-col gap-4 p-4 pt-0">
          {result && <Alert status={result.status} message={result.message} />}
          <textarea
            placeholder="¿Qué estás pensando?"
            className="border-border-input focus:border-primary resize-none rounded-2xl border p-2 focus:outline-none"
            maxLength="255"
            required
            rows="3"
          />
          <input type="file" className="ml-2" />
          <input
            type="submit"
            value="Publicar"
            className="bg-primary hover:bg-primary-hover cursor-pointer rounded-2xl p-2 font-semibold"
          />
        </form>
      )}
    </div>
  );
};
