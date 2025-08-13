import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./select"
import { Tag } from "emblor";

interface Props extends React.ComponentProps<"input"> {
  name?: string
  options: Tag[];
  label?: string;
  onChangeValue: (newValue: string) => void;
}
export function SelectInput({ name, options, placeholder, label, value, onChangeValue }: Props) {
  return (
    <Select
      value={value ? String(value) : undefined}
      onValueChange={(newSelected) => onChangeValue(newSelected as string)}
    >
      <SelectTrigger name={name} className="w-full">
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