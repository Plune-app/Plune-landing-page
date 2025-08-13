import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"
import { Tag } from "emblor";

interface Props extends React.ComponentProps<"input"> {
  options: Tag[];
  label?: string;
  onChange: (val : unknown) => void;
}
export function SelectControlled({ options, placeholder, label, value, disabled, onChange, }: Props) {
  return (
    <Select onValueChange={(newSelected) => !disabled && onChange(newSelected)} value={value as string}>
      <SelectTrigger disabled={disabled} className="w-full">
        <SelectValue
          placeholder={placeholder}
          className=" max-w-2.5 text-ellipsis overflow-hidden"
        />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.length > 0 && options?.map((opt) => (
            <SelectItem key={opt.id} value={opt.id}>{opt.text}</SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}