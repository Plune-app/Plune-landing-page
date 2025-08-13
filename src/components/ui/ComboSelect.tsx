import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useState } from "react"
import { Option } from "./MultiSelectControlled"
import { twMerge } from "tailwind-merge"
interface ComboSelectProps<T extends string> {
  value: T;
  setValue: (value: T) => void;
  options: Option[];
  placeholder: string;
  className?: string;
  align? : "end" | "start" | "center";
}
export function ComboSelect<T extends string>({ 
  setValue, 
  value, 
  options, 
  placeholder, 
  className,
  align
}: ComboSelectProps<T>) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="w-full" >
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={twMerge(["w-[160px] justify-between", className])}
        >
          {value
            ? options.find((opt) => opt.value === value)?.label
            : placeholder ? <span className="text-muted-foreground">{placeholder}</span>  : "Selecione"}
          <ChevronsUpDown className="opacity-50" />
        </Button>
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
                    setValue(currentValue === value ? "" : currentValue)
                    setOpen(false)
                  }}
                >
                  {option.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === option.value ? "opacity-100" : "opacity-0"
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
