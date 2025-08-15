import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { FormInput, FormInputProps } from "../ui/FormInput";
import { FormField, FormSections } from "@/@types/Form";
import { Dispatch, SetStateAction, useCallback } from "react";
import { GenericCheckbox } from "../ui/GenericCheckbox";
import { TagSchema } from "@/lib/DTO/flow.dto";
import { FieldProperty } from "./FieldSlot";
import { Tag } from "emblor";
import { SelectControlled } from "../ui/SelectControled";

interface FormSectionSlotProps {
  section: FormSections;
  sectionSlots: FormSections[];
  setSectionsSlots?: Dispatch<SetStateAction<FormSections[]>>;
  canManipulate?: boolean;
}
export function FormSectionSlot(props: FormSectionSlotProps) {
  return (
    <div className={`w-full flex `}>
      {props.section.fields.length > 0 && (
        <div
          className={`w-full gap-4 `}
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${props.section.layout.charAt(props.section.layout.length - 1)}, minmax(0, 1fr))`,
            gridColumn: 4
          }}
        >
          {props.section.fields.map((field) => (
            <FormFieldSlot
              key={field.id}
              section={props.section}
              sectionSlots={props.sectionSlots}
              field={field}
              setSectionsSlots={props.setSectionsSlots}
            />
          ))}
        </div>
      )}
    </div>
  )
}
interface FormFieldSlotProps extends Pick<FormSectionSlotProps, "sectionSlots" | "setSectionsSlots" | "section" | "canManipulate"> {
  field: FormField;
}
export function FormFieldSlot({
  field,
  sectionSlots,
  setSectionsSlots,
  section,
  canManipulate
}: FormFieldSlotProps) {
  const onChangeFieldProperties = useCallback((e: (string | TagSchema[]), type: FieldProperty) => {
    setSectionsSlots!(
      sectionSlots.map((section) => {
        if (section.id == section.id) {
          return {
            ...section,
            fields: section.fields.map((fieldMapped) => {
              if (fieldMapped.id == field.id) {
                return { ...field, [type]: e, }
              }
              return fieldMapped;
            })
          }
        }
        return section;
      })
    )
  }, [sectionSlots, section, field]);

  function RenderInputAccordingFieldType<T extends string>(props: FormInputProps<T>) {
    switch (field.type) {
      case "date":
        return <FormInput {...props} type="date" />
      case "email":
        return <FormInput {...props} type="email" />
      case "text":
        return <FormInput {...props} type="text" />
      case "number":
        return <FormInput {...props} type="number" />
      //adicionar selecionaveis com options, como multi select, combo, select from other database
      case "checkbox":
        return <GenericCheckbox
          disabled={props.disabled}
          checkedList={field.values ?? []}
          items={field.options ?? []}
          onCheckChange={(values) => onChangeFieldProperties(values, "values")}
        />
      case "select":
        return <SelectControlled
          disabled={props.disabled}
          placeholder={field.placeholder}
          options={field.options as Tag[] ?? []}
          name={props.name!}
          label={field.label}
          value={field.value}
          onChange={(val) => { onChangeFieldProperties(field.options?.find(opt => opt.id == val)?.text as string, "value") }}
        />
      default:
        return <FormInput {...props} type="text" />
    }
  }

  const onChangeFieldValue = useCallback((e: string) => {
    setSectionsSlots && setSectionsSlots(
      sectionSlots.map((section) => {
        if (section.id == section.id) {
          return {
            ...section,
            fields: section.fields.map((fieldMapped) => {
              if (fieldMapped.id == field.id) {
                return { ...field, value: e }
              }
              return fieldMapped;
            })
          }
        }
        return section;
      })
    )
  }, [sectionSlots, section, field]);

  return (
    <FormItem className={`p-2 rounded-lg   w-full`}>
      <FormLabel className="text-muted-foreground">{field.label}</FormLabel>
      <RenderInputAccordingFieldType
        disabled={!canManipulate}
        onBlur={(e) => onChangeFieldValue(e.target.value)}
        name={field.id}
        required={field.required}
        value={field.value ?? ""}
        placeholder={field.placeholder}
      />
      <FormDescription className="cursor-text text-muted-foreground ">{field.description}</FormDescription>
      <FormMessage />
    </FormItem>
  )
}