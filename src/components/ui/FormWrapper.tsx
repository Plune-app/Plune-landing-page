import { ReactNode } from "react"
import { useFormContext } from "react-hook-form";
import { twMerge } from "tailwind-merge";

interface Props<T extends object> {
  children: ReactNode;
  handleSubmitForm: (data: T) => Promise<unknown>;
  className?: string;
}
export function FormWrapper<T extends object>({ handleSubmitForm, children, className }: Props<T>) {
  const { handleSubmit } = useFormContext<T>();
  return (
    <form onSubmit={handleSubmit(handleSubmitForm)} className={twMerge(["flex flex-col gap-5 "], [className])}>
      {children}
    </form>
  )
}