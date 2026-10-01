import { cn } from "@/lib/utils";

interface FormAlertProps {
  message: string;
  variant: "error" | "success";
}

export default function FormAlert({ message, variant }: FormAlertProps) {
  return (
    <p
      role={variant === "error" ? "alert" : "status"}
      className={cn(
        "rounded-md border px-3 py-2 text-sm",
        variant === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-green-300 bg-green-50 text-green-800",
      )}
    >
      {message}
    </p>
  );
}
