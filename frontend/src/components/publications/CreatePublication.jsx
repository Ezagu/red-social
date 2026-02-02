import { useId, useRef } from "react";
import { X, ImagePlus } from "lucide-react";
import { usePublication } from "../../hooks/usePublication.jsx";
import { Alert } from "../ui/Alert.jsx";
import { ButtonLoading } from "../ui/ButtonLoading.jsx";
import { useFilePreview } from "../../hooks/useFilePreview.jsx";

export const CreatePublication = () => {
  const fileInput = useId();
  const inputRef = useRef(null);
  const { uploadPublication, result, clearResult, loading } = usePublication();
  const { handlePreview, removePreview, preview } = useFilePreview(inputRef);

  return (
    <form
      className="flex flex-col gap-4 p-4"
      onSubmit={uploadPublication}
      onChange={clearResult}
    >
      <textarea
        placeholder="¿Qué estás pensando?"
        className="border-border-input focus:border-primary field-sizing-content resize-none rounded-2xl border p-2 py-3 text-xl focus:outline-none"
        maxLength="255"
        required
        name="text"
      />
      {preview && (
        <div className="relative w-full">
          <button
            className="bg-surface absolute top-2 right-2 cursor-pointer rounded-full p-2"
            type="button"
            onClick={removePreview}
          >
            <X />
          </button>
          <img
            src={preview}
            className="border-border-input max-h-64 w-full rounded-2xl border object-contain"
          />
        </div>
      )}
      {result && <Alert status={result.status} message={result.message} />}
      <div className="flex w-full items-center justify-between">
        <label
          className="hover:bg-primary text-text-secondary hover:text-text-primary cursor-pointer rounded-full p-2"
          htmlFor={fileInput}
        >
          <ImagePlus />
        </label>
        <input
          ref={inputRef}
          name="files"
          type="file"
          className="hidden"
          id={fileInput}
          onChange={handlePreview}
        />
        <ButtonLoading type="submit" loading={loading}>
          {loading ? "Publicando" : "Publicar"}
        </ButtonLoading>
      </div>
    </form>
  );
};
