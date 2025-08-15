import { FormSections, SectionLayout } from "@/@types/Form";
import { Reorder, useDragControls, useMotionValue } from "framer-motion";
import { Dispatch, SetStateAction, useCallback } from "react";
import { Button } from "../ui/button";
import { GripVertical, LayoutTemplate, Plus, Tally1, Tally2, Tally3, Tally4, Trash } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { DropdownMenu, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CustomDropdownMenuItem } from "../UserDropdown";
import { FieldStlot } from "./FieldSlot";

interface BaseProps {
  sectionsSlots: FormSections[];
  section: FormSections;
}

interface PropsWithManipulation extends BaseProps {
  canManipulate: true;
  setSectionsSlots: Dispatch<SetStateAction<FormSections[]>>;
  onFieldsReorder: (newOrder: (number | string)[], sectionId: string) => void;
  handleAddField: (sectionId: string) => void;
  handleDeleteSection: (id: string | number) => void;
  handleDeleteField: (id: string | number, sectionId: string) => void;
}

interface PropsWithoutManipulation extends BaseProps {
  canManipulate?: false;
}

type SectionSlotProps = PropsWithManipulation | PropsWithoutManipulation;


export function SectionSlot(props: SectionSlotProps) {

  const y = useMotionValue(0);
  const dragControls = useDragControls();
  const handleChangeSectionLayout = useCallback((newLayout: SectionLayout) => {
    if (props.canManipulate) {
      props.setSectionsSlots!(
        props.sectionsSlots.map((sec) => {
          if (sec.id == props.section.id) {
            return { ...sec, layout: newLayout }
          }
          return sec
        })
      )
    }

  }, [props.sectionsSlots, props.section])
  return (
    <Reorder.Item
      key={props.section.id}
      id={props.section.id}
      value={props.section.id}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      dragListener={false}
      style={{ y }}
      dragControls={dragControls}
      className="flex w-full gap-2 relative border-b pb-2"
    >
      <aside className="flex flex-col my-auto  gap-2 transition duration-200">
        {props.canManipulate && (
          <>
            <Button
              variant={"ghost"}
              size={"icon"}
              onPointerDown={(e) => dragControls.start(e)}
              type="button"
              className="cursor-grab"
            >
              <GripVertical />
            </Button>
            <Button
              size={"icon"}
              onClick={() => props.handleDeleteSection!(props.section.id)}
              variant={"destructive"}
            >
              <Trash />
            </Button>
          </>
        )}
      </aside>
      <div className={`w-full flex `}>
        {props.section.fields.length > 0 && (
          <Reorder.Group
            axis="x"
            values={props.section.fields.map((field) => field.id)}
            onReorder={(newOrder) => props.canManipulate && props.onFieldsReorder!(newOrder, props.section.id)}
            className={`w-full gap-2 p-4`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${props.section.layout.charAt(props.section.layout.length - 1)}, minmax(0, 1fr))`,
              gridColum: 4
            }}
          >
            {props.section.fields.map((field) => (
              <FieldStlot
                section={props.section}
                sectionsSlots={props.sectionsSlots}
                setSectionsSlots={props.canManipulate ? props.setSectionsSlots! : undefined}
                key={field.id}
                field={field}
                handleDeleteField={() => props.canManipulate && props.handleDeleteField!(field.id, props.section.id)}
                canManipulate={props.canManipulate}
              />
            ))}
          </Reorder.Group>
        )}
      </div>
      <aside className="flex flex-col gap-2 items-center justify-center">
        {props.canManipulate && (
          <>
            <Tooltip>
              <TooltipTrigger type="button">
                <Button
                  size={"icon"}
                  variant={"outline"}
                  type="button"
                  onClick={() => props.handleAddField!(props.section.id)}
                >
                  <Plus size={15} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                Create an new field
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger type="button">
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <Button
                      size={"icon"}
                      variant={"outline"}
                      type="button"
                      onClick={() => props.handleAddField!(props.section.id)}
                    >
                      <LayoutTemplate size={15} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>
                      Layout
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <CustomDropdownMenuItem
                      active={props.section.layout == "cols-1"}
                      title="cols-1"
                      onClick={() => handleChangeSectionLayout("cols-1")}
                      icon={Tally1}
                    />
                    <CustomDropdownMenuItem
                      active={props.section.layout == "cols-2"}
                      title="cols-2"
                      onClick={() => handleChangeSectionLayout("cols-2")}
                      icon={Tally2}
                    />
                    <CustomDropdownMenuItem
                      active={props.section.layout == "cols-3"}
                      title="cols-3"
                      onClick={() => handleChangeSectionLayout("cols-3")}
                      icon={Tally3}
                    />
                    <CustomDropdownMenuItem
                      active={props.section.layout == "cols-4"}
                      title="cols-4"
                      onClick={() => handleChangeSectionLayout("cols-4")}
                      icon={Tally4}
                    />
                  </DropdownMenuContent>
                </DropdownMenu>
              </TooltipTrigger>
              <TooltipContent  >
                Change section layout
              </TooltipContent>
            </Tooltip>
          </>
        )}
      </aside>
    </Reorder.Item>
  )
}
