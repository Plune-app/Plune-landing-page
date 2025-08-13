import { ChangeEvent, useState } from "react";
import { Command, CommandGroup, CommandItem, CommandList } from "./command";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { twMerge } from "tailwind-merge";
import { Check } from "lucide-react";
import { Option } from "./MultiSelectControlled";
import { cn } from "@/lib/utils";
import { Input } from "./input";
export interface SelectableProps {
  value?: string;
}
interface Props<T extends SelectableProps> {
  data: T;
  setData: (value?: T) => void;
  options: Option[];
  placeholder: string;
  className?: string;
  align?: "end" | "start" | "center";
  onChange: (e: ChangeEvent) => void
}
export function InputCommand<T extends SelectableProps>({
  options,
  placeholder,
  setData,
  data,
  align,
  className,
  onChange
}: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Input
          className={twMerge(className)}
          value={data.value
            ? options.find((opt) => opt.value === data.value)?.label
            : placeholder ? placeholder : "Selecione"}
          onChange={onChange}
        />
      </PopoverTrigger>
      <PopoverContent align={align} className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={(currentValue: any) => {
                    setData(currentValue === data.value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      data.value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}