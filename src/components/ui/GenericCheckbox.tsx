import { memo } from "react";
import { Checkbox } from "./checkbox";
import { Label } from "./label";
import { TagSchema } from "@/lib/DTO/flow.dto";
interface GenericCheckboxProps {
  items: TagSchema[];
  checkedList: TagSchema[];
  onCheckChange: (newCheckedList: TagSchema[]) => void;
  disabled? : boolean;
}
export const GenericCheckbox = memo(({
  items,
  checkedList,
  onCheckChange,
  disabled  
}: GenericCheckboxProps) => {
  return (
    <main className="flex flex-col gap-1">
      {items.length > 0 && items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          <Checkbox
            disabled={disabled}
            id={item.id}
            checked={!!checkedList.find((check) => check.id == item.id)}
            onCheckedChange={(checked) => {
              if (checked) {
                onCheckChange([...checkedList, item]);
                return;
              }
              const checkedItemsUpdated = checkedList.filter(checkedItem => checkedItem.id != item.id);
              onCheckChange(checkedItemsUpdated);
            }}
          />
          <Label htmlFor={item.id} className="text-sm font-normal">{item.text}</Label>
        </div>
      ))}
    </main>

  )
})