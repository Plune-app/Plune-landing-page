import { useFormContext, Controller } from "react-hook-form";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select";
import { Tag } from "emblor";
import { twMerge } from "tailwind-merge";

interface Props<T extends string> {
  name: T;
  options: Tag[];
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  className? : string;
  value?: string;
}

export function FormSelect<T extends string>({ name, options, placeholder, label, disabled, className, value }: Props<T>) {
  const { control } = useFormContext();
  return (
    <Controller
      control={control}
      name={name as any}
      render={({ field }) => (
        <Select
          value={value ? value : field.value} // <-- mantém sincronizado
          onValueChange={(newSelected) => {
            if (!disabled) field.onChange(newSelected);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue
              placeholder={placeholder}
              className={twMerge("max-w-2.5 text-ellipsis overflow-hidden", className)}
            />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {label && <SelectLabel>{label}</SelectLabel>}
              {options.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.text}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      )}
    />
  );
}
