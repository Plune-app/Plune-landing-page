"use client"

import { useCallback, useState } from "react"
import { Tag } from "emblor"

import { Label } from "@/components/ui/label"
import { Button } from "./button";
import { Plus, X } from "lucide-react";
import { Input } from "./input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./dialog";
interface Props {
  label?: string;
  onChange: (newOptions: Tag[]) => void;
  selected?: Tag[];
  isOpen?: boolean;
  setIsOpen?: (open: boolean) => void;
}
export function InputWithTags({ label, onChange, selected, isOpen, setIsOpen }: Props) {
  const [options, setOptions] = useState<Tag[]>(selected ?? []);
  const [tagValue, setTagValue] = useState("");

  const handleDeleteOption = useCallback((id: string) => {
    const newOptions = options.filter((option) => option.id != id)
    setOptions(newOptions);
  }, [options]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger >
        <Button variant={"ghost"} type="button" size={"icon"}>
          <Plus size={10} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>
          Add items
        </DialogTitle>
        <DialogDescription>
          Add some items inside select field
        </DialogDescription>
        <div>
          <div className="*:not-first:mt-2 ">
            <Label >{label}</Label>
            <div
              className="relative flex flex-col gap-2"
            >
              <Input
                value={tagValue}
                onChange={(e) => setTagValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key == "Enter" && tagValue) {
                    const newOption = { text: tagValue, id: crypto.randomUUID() }
                    setOptions([...options, newOption]);
                    setTagValue('');
                  }
                }}
              />
              <div className="flex items-start gap-2 flex-wrap">
                {options.length > 0 && options.map((option) => (
                  <div key={option.id} className="w-fit flex items-center justify-center relative h-7 bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7">
                    {option.text}
                    <Button
                      type="button"
                      className="absolute -inset-y-px -end-px p-0 rounded-s-none rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground"
                      variant={"ghost"}
                      onClick={(e) => {
                        e.preventDefault()
                        handleDeleteOption(option.id)
                      }}
                    >
                      <X size={10} />
                    </Button>
                  </div>
                ))}
              </div>

              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const newOptions = [...options, { text: tagValue, id: crypto.randomUUID() }]
                  setOptions(newOptions)
                  setTagValue("");
                }}
                disabled={!tagValue}
                className="absolute h-7 w-7 top-1 right-1 "
                size={"icon"}
                variant={"ghost"}
              >
                <Plus size={10} />
              </Button>
            </div>

          </div>

        </div>
        <Button onClick={() => onChange(options)} type="button" >
          Save
        </Button>
      </DialogContent>
    </Dialog>
  )
}
