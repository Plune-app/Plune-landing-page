import { Trash } from "lucide-react";
import { Button } from "./button";
import { TypographySmall } from "./Typography";

export function DeleteTrigger({ onClick }: { onClick: () => void }) {
  return (
    <Button
      size={"sm"}
      className="w-full justify-start"
      variant={"ghost"}
      onClick={onClick}
    >
      <Trash size={15} />
      <TypographySmall content={"Delete"} />
    </Button>
  );
}