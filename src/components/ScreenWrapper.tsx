import type { ReactNode } from "react"

interface Props {
  children: ReactNode;
}
export function ScreenWrapper({ children }: Props) {
  return (
    <div className="h-full w-full  bg-gradient-to-br from-zinc-50 via-white to-zinc-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-800 transition-colors duration-500 verflow-auto relative  p-3 flex flex-col gap-2" >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-zinc-200/30 to-transparent dark:from-zinc-800/30 dark:to-transparent rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-zinc-300/20 to-transparent dark:from-zinc-700/20 dark:to-transparent rounded-full blur-3xl"></div>
      </div>
      {children}
    </div>
  )
}