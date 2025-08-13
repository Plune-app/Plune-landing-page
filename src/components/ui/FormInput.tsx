import * as React from "react"

import { cn } from "@/lib/utils"
import { useFormContext } from "react-hook-form"
import { Button } from "./button";
import { Eye, EyeClosed } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";
export interface FormInputProps<T extends string> extends React.ComponentProps<"input"> {
  name?: T
  type?: "text" | "email" | "password" | "number" | "date";
}
function FormInput<T extends string>({ className, type = "text", name, disabled, ...props  }: FormInputProps<T>) {
  const { formState: { errors, }, register } = useFormContext();
  const [isVisible, setIsVisible] = React.useState<boolean>(false);

  return (
    <div className="flex flex-col gap-2">
      <fieldset className="flex w-full relative">
        <input
          {...register(name!)}
          type={isVisible ? "text" : type}
          data-slot="input"
          disabled={disabled}
          className={cn(
            " file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
            className
          )}
          {...props}
        />
        {type == "password" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={"ghost"}
                type="button"
                className="absolute  z-20 top-1 right-1 w-7 h-7"
                onClick={() => setIsVisible(!isVisible)}
                size={"icon"}
              >
                {isVisible ? <Eye size={10} /> : <EyeClosed size={10} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {isVisible ? "Hide password" : "Show password"}
            </TooltipContent>
          </Tooltip>
        )}
      </fieldset>


      {errors && errors[name!] && (
        <div className="text-destructive text-sm">
          {errors[name!]?.message?.toString()}
        </div>
      )}
    </div>

  )
}

export { FormInput }
