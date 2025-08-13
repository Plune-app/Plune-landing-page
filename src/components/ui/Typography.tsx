import { twMerge } from "tailwind-merge";

interface Props {
  content: string;
  className?: string;
}
export function TypographyLarge({ content, className }: Props) {
  return <div className={twMerge(["text-lg font-semibold", className])}>
    {content}
  </div>
}
export function TypographyLead({ content, className }: Props) {
  return (
    <p className={twMerge(["text-muted-foreground text-xl" , className])}>
      { content }
    </p >
  )
}
export function TypographySmall({ content, className }: Props) {
  return (
    <small className={twMerge(["text-sm leading-none font-medium" , className])}>
      { content }
    </small >
  )
}
export function TypographyMuted({ content, className }: Props) {
  return (
    <p className={twMerge(["text-muted-foreground text-sm" , className])}>
      { content }
    </p >
  )
}
export function TypographyH1({ content, className }: Props) {
  return (
    <h1 className={twMerge(["scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance" , className])}>
      { content }
    </h1 >
  )
}
export function TypographyH2({ content, className }: Props) {
  return (
    <h2 className={twMerge(["scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0" , className])}>
      { content }
    </h2 >
  )
}
export function TypographyH3({ content, className }: Props) {
  return (
    <h3 className={twMerge(["scroll-m-20 text-2xl font-semibold tracking-tight" , className])}>
      { content }
    </h3 >
  )
}
export function TypographyH4({ content, className }: Props) {
  return (
    <h4 className={twMerge(["scroll-m-20 text-xl font-semibold tracking-tight" , className])}>
      { content }
    </h4 >
  )
}