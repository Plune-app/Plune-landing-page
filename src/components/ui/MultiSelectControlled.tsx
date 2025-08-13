'use client'

import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Command, CommandGroup, CommandItem } from "@/components/ui/command"
import { Checkbox } from "@/components/ui/checkbox"
import { useState } from "react"

export interface Option {
  label: string;
  value: string;
}
interface Props {
  options: Option[];
  selected: string[];
  setSelected: (selected: string[]) => void;
  defaultValues?: string[];
  onChange?: (selected: string[]) => void;
  placeholder?: string;
}
export default function MultiSelectControlled({
  onChange,
  options,
  placeholder,
  selected,
  setSelected
}: Props) {
  const [open, setOpen] = useState(false)
  const toggleSelect = (value: string) => {
    const newSelected = selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
    setSelected(newSelected)
    if (onChange) {
      onChange(newSelected);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger type="button" className="w-full">
        <Button type="button" variant="outline" className="w-full justify-start">
          {selected.length > 0
            ? `${selected.length}/${options.length} Selected(s)`
            : placeholder ? placeholder : "Select options"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => toggleSelect(option.value)}
              >
                <Checkbox
                  checked={selected.includes(option.value)}
                  className="mr-2"
                />
                <span>{option.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
