import { Button } from "./Button";
import { LoaderCircle } from "lucide-react";

export const ButtonLoading = ({ children, loading = false, ...props }) => {
  const { className, ...remainingProps } = props;
  return (
    <Button
      disabled={loading}
      {...remainingProps}
      className={
        (loading
          ? "bg-primary/50 hover:bg-primary/50 hover:cursor-default "
          : "hover:bg-primary-hover cursor-pointer ") + className
      }
    >
      <div className="flex items-center justify-center gap-2">
        {loading && <LoaderCircle className="size-6 animate-spin" />}
        {children}
      </div>
    </Button>
  );
};
