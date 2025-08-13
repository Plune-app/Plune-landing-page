import { Loader2 } from "lucide-react";
import { Button } from "./button";
import { twMerge } from "tailwind-merge";
interface Props {
  isPending: boolean;
  title?: string;
  className?: string;
}
export function SubmitButton({ isPending, title = "Save", className }: Props) {

  return (
    <Button
      className={twMerge(className)}
      type="submit"
      disabled={isPending}
    >
      {title} {isPending && <Loader2 size={15} className="animate-spin" />}
    </Button>
  )
}