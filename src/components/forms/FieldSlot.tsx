import { FormField as FormFieldType, FormSections, FormFieldType as InputType, } from "@/@types/Form";
import { TagSchema } from "@/lib/DTO/flow.dto";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, useCallback, useEffect, useState } from "react";
import { FormInput, FormInputProps } from "../ui/FormInput";
import { InputWithTags } from "../ui/InputWithTags";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUp10, Calendar, GripHorizontal, Key, Mail, Settings, Text, TextSelect, TextSelectionIcon, Trash, Type } from "lucide-react";
import { CustomDropdownMenuItem } from "../UserDropdown";
import { FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "../ui/dialog";
import { GenericCheckbox } from "../ui/GenericCheckbox";
import { SelectControlled } from "../ui/SelectControled";
import { Tag } from "emblor";
export type FieldProperty =
  "name" |
  "label" |
  "description" |
  "placeholder" |
  "type" |
  "options" |
  "values" |
  "value";
interface FieldSlotProps {
  field: FormFieldType;
  section: FormSections;
  handleDeleteField: (id: string | number) => void;
  setSectionsSlots?: Dispatch<SetStateAction<FormSections[]>>;
  sectionsSlots: FormSections[];
  canManipulate?: boolean;
}
export function FieldStlot({
  field,
  handleDeleteField,
  sectionsSlots,
  setSectionsSlots,
  section,
  canManipulate = true
}: FieldSlotProps) {

  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const [isEditing, setIsEditing] = useState({
    isEditingLabel: false,
    isEditingPlaceholder: false,
    isEditingDescription: false,
  });
  const onChangeFieldOptions = useCallback((opts: TagSchema[]) => {
    canManipulate && setSectionsSlots!(
      sectionsSlots.map((sec) => {
        if (sec.id == section.id) {
          return {
            ...sec,
            fields: sec.fields.map((secField) => {
              if (secField.id == field.id) {
                return { ...secField, options: opts }
              }
              return secField
            })
          }
        }
        return sec
      })
    )
  }, [section, sectionsSlots, field]);


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
      case "checkbox":
        return <div className="flex items-center gap-1">
          {canManipulate && (
            <InputWithTags
              selected={field.options}
              onChange={(options) => onChangeFieldOptions(options)}
            />
          )}
          <GenericCheckbox
            checkedList={field.values ?? []}
            items={field.options ?? []}
            onCheckChange={(values) => onChangeFieldProperties(values, "values")}
          />
        </div>
      case "select":
        return <div className="flex items-center gap-1">
          {canManipulate && (
            <InputWithTags
              selected={field.options}
              onChange={(options) => onChangeFieldOptions(options)}
            />
          )}
          <SelectControlled 
            {...props}
            onChange={(val) => onChangeFieldProperties(val as string, "value")}
            options={field.options as Tag[] ?? []}
            label={field.label}
          />
        </div>
      default:
        return <FormInput {...props} type="text" />
    }
  }
  const onChangeFieldObject = useCallback((fieldObject: FormFieldType) => {
    canManipulate && setSectionsSlots!(
      sectionsSlots.map((section) => {
        if (section.id == section.id) {
          return {
            ...section,
            fields: section.fields.map((fieldMapped) => {
              if (fieldMapped.id == field.id) {
                return { ...field, ...fieldObject }
              }
              return fieldMapped;
            })
          }
        }
        return section;
      })
    )
  }, [sectionsSlots, section, field])
  const onChangeFieldProperties = useCallback((val: (string | TagSchema[]), type: FieldProperty) => {
    canManipulate && setSectionsSlots!(
      sectionsSlots.map((section) => {
        if (section.id == section.id) {
          return {
            ...section,
            fields: section.fields.map((fieldMapped) => {
              if (fieldMapped.id == field.id) {
                return { ...field, [type]: val, }
              }
              return fieldMapped;
            })
          }
        }
        return section;
      })
    )
  }, [sectionsSlots, section, field]);

  function InputTypeDropdown({ changeInputType }: { changeInputType: (newType: InputType) => void }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger type="button">
          <Button type="button" variant={"outline"} size={"icon"}>
            <Type size={15} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>
            Type
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <CustomDropdownMenuItem
            title="Text"
            onClick={() => changeInputType("text")}
            icon={Text}
          />
          <CustomDropdownMenuItem
            title="E-mail"
            onClick={() => changeInputType("email")}
            icon={Mail}
          />
          <CustomDropdownMenuItem
            title="Password"
            onClick={() => changeInputType("password")}
            icon={Key}
          />
          <CustomDropdownMenuItem
            title="Number"
            onClick={() => changeInputType("number")}
            icon={ArrowUp10}
          />
          <CustomDropdownMenuItem
            title="Date"
            onClick={() => changeInputType("date")}
            icon={Calendar}
          />
          <CustomDropdownMenuItem
            title="Select"
            onClick={() => changeInputType("select")}
            icon={TextSelect}
          />
          <CustomDropdownMenuItem
            title="Checkbox"
            onClick={() => changeInputType("checkbox")}
            icon={TextSelectionIcon}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    )

  }

  function DialogFieldSettings() {
    const [isOpen, setIsOpen] = useState(false);
    const [isInputWithTagsOpen, setIsInputWithTagsOpen] = useState(false);
    const [fieldNameRegistered, setFieldNameRegistered] = useState(false);
    const [inputProperties, setInputProperties] = useState({
      label: field.label,
      description: field.description,
      placeholder: field.placeholder,
      name: field.name,
      type: field.type,
      options: field.options ?? [],
      values: field.values ?? [],
      value: field.value ?? "",
    });
    const onChangeInputProperties = useCallback((value: (string | TagSchema[]), property: FieldProperty) => {
      setInputProperties({
        ...inputProperties,
        [property]: value
      })
    }, [inputProperties]);

    const onChangeInputPropertiesOptions = useCallback((opts: TagSchema[]) => {
      setInputProperties({ ...inputProperties, options: opts })
    }, [inputProperties]);

    const handleSave = useCallback(() => {
      onChangeFieldObject({ ...inputProperties as FormFieldType });
    }, [inputProperties]);

    useEffect(() => {
      const fieldFound = sectionsSlots
        .find(
          (section) => section.fields
            .find(
              (fieldItem) => fieldItem.name == inputProperties.name && field.id != fieldItem.id));
      if (fieldFound) {
        setFieldNameRegistered(true);
        return;
      }
      setFieldNameRegistered(false)
    }, [inputProperties.name])
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger type="button" className="absolute top-0.5 right-0.5">
          <Button type="button" variant={'ghost'} size={"icon"}>
            <Settings size={15} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogTitle>
            Input properties
          </DialogTitle>
          <DialogDescription>
            Here you can change all input properties
          </DialogDescription>
          <FormItem>
            <FormLabel htmlFor="name">
              Name
            </FormLabel>
            <Input
              id="name"
              onChange={(e) => onChangeInputProperties(e.target.value, "name")}
              defaultValue={inputProperties.name}
              placeholder="input name here"
            />
            {fieldNameRegistered && (
              <span className="text-destructive text-sm">
                Field with this name already registered
              </span>
            )}
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="label">
              Label
            </FormLabel>
            <Input
              id="label"
              onChange={(e) => onChangeInputProperties(e.target.value, "label")}
              placeholder="Change the input label"
              defaultValue={inputProperties.label}
            />
          </FormItem>

          <FormItem>
            <FormLabel htmlFor="placeholder">
              Placeholder
            </FormLabel>
            <Input
              id="placeholder"
              onChange={(e) => onChangeInputProperties(e.target.value, "placeholder")}
              placeholder="Change the placeholder tip"
              defaultValue={inputProperties.placeholder}
            />
          </FormItem>
          <FormItem>
            <FormLabel htmlFor="description">
              Description
            </FormLabel>
            <Input
              id="description"
              onChange={(e) => onChangeInputProperties(e.target.value, "description")}
              placeholder="Add some description"
              defaultValue={inputProperties.description}
            />
          </FormItem>

          <main className="flex items-center gap-1">
            <InputTypeDropdown changeInputType={(type) => onChangeInputProperties(type, "type")} />

            {inputProperties.type == "select" ? (
              // was necessary to treat this way for change options only in backstage
              <div className="flex items-center gap-1 w-full">
                {canManipulate && (
                  <InputWithTags
                    isOpen={isInputWithTagsOpen}
                    setIsOpen={setIsInputWithTagsOpen}
                    selected={inputProperties.options}
                    onChange={(options) => {
                      onChangeInputPropertiesOptions(options);
                      setIsInputWithTagsOpen(false);
                    }}
                  />
                )}
                <SelectControlled
                  className="w-full"
                  placeholder={inputProperties.placeholder}
                  options={inputProperties.options ?? []}
                  name={inputProperties.name!}
                  label={inputProperties.label}
                  onChange={(selected) => setInputProperties({...inputProperties, value: selected as string})}
                />
              </div>
            ) : inputProperties.type == "checkbox" ? (
              // was necessary to treat this way for change options only in backstage
              <div className="flex items-center gap-1 w-full">
                {canManipulate && (
                  <InputWithTags
                    isOpen={isInputWithTagsOpen}
                    setIsOpen={setIsInputWithTagsOpen}
                    selected={inputProperties.options}
                    onChange={(options) => {
                      onChangeInputPropertiesOptions(options);
                      setIsInputWithTagsOpen(false);
                    }}
                  />
                )}
                <GenericCheckbox
                  checkedList={inputProperties.values}
                  items={inputProperties.options}
                  onCheckChange={(values) => onChangeInputProperties(values, "values")}
                />
              </div>
            ) : (
              <RenderInputAccordingFieldType
                name={field.id}
                required={field.required}
                value={field.value ?? ""}
                placeholder={field.placeholder}
              />
            )}
          </main>
          <Button
            disabled={fieldNameRegistered}
            onClick={handleSave}
            type="button"
          >
            Save
          </Button>
        </DialogContent>
      </Dialog>
    )
  }
  return (
    <Reorder.Item
      key={field.id}
      id={field.id}
      value={field.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dragListener={false}
      style={{ y }}
      dragControls={dragControls}
      className="flex w-full gap-2 relative group"
    >
      {canManipulate && (
        <aside className="flex flex-col gap-0.5 opacity-0 group-hover:opacity-100 transition duration-200">
          <InputTypeDropdown changeInputType={(type) => onChangeFieldProperties(type, "type")} />
          {Number(section.layout.charAt(section.layout.length - 1)) >= section.fields.length && (
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-grab"
              onPointerDown={(e) => dragControls.start(e)}
              type="button"
            >
              <GripHorizontal />
            </Button>
          )}
          <Button size={"icon"} onClick={() => handleDeleteField(field.id)} variant={"destructive"} >
            <Trash />
          </Button>
        </aside>
      )}
      <FormItem className={`relative p-2 rounded-lg  ${canManipulate ? "border border-dashed" : ""}  w-full`}>
        <DialogFieldSettings />
        <div className="text-muted-foreground cursor-text" onDoubleClick={() => setIsEditing({ ...isEditing, isEditingLabel: true })}>
          {isEditing.isEditingLabel && canManipulate ? (
            <input
              className="text-sm border h-[20px] px-2 rounded-sm border-zinc-100 dark:border-zinc-700 "
              value={field.label}
              onChange={(e) => onChangeFieldProperties(e.target.value, "label")}
              onBlur={() => setIsEditing({ ...isEditing, isEditingLabel: false })}
            />
          ) : (
            <FormLabel className="h-[20px]">{field.label}</FormLabel>
          )}
        </div>
        <div className="w-full">
          {isEditing.isEditingPlaceholder ? (
            <Tooltip delayDuration={500}>
              <TooltipTrigger className="w-full" type="button">
                <Input
                  placeholder="Type here to change placeholder"
                  onChange={(e) => onChangeFieldProperties(e.target.value, "placeholder")}
                  onBlur={() => setIsEditing({ ...isEditing, isEditingPlaceholder: false })}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Click outside to save</p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip delayDuration={500}>
              <TooltipTrigger
                className="w-full"
                onDoubleClick={() => setIsEditing({ ...isEditing, isEditingPlaceholder: true })}
                type="button"
              >
                <RenderInputAccordingFieldType
                  name={field.id}
                  required={field.required}
                  value={field.value ?? ""}
                  placeholder={field.placeholder}
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Double click for update placeholder</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>


        <div className="text-muted-foreground " onDoubleClick={() => setIsEditing({ ...isEditing, isEditingDescription: true })}>
          {isEditing.isEditingDescription && canManipulate ? (
            <input
              className="text-sm w-fit h-[20px] border px-2 rounded-sm cursor-text border-zinc-100 dark:border-zinc-700 "
              value={field.description}
              onChange={(e) => onChangeFieldProperties(e.target.value, "description")}
              onBlur={() => setIsEditing({ ...isEditing, isEditingDescription: false })}
            />
          ) : (
            <FormDescription className="cursor-text">{field.description}</FormDescription>
          )}

        </div>
        <FormMessage />
      </FormItem >
    </Reorder.Item >
  )
}
