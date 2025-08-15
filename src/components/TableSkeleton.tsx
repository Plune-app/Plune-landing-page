import { useThemeStore } from "@/store/theme";
import { ReactNode } from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css'

export function TableSkeleton() {

  return (
    <SkeletonThemeProvider >
      <div className="flex flex-col gap-3">
        <header className="flex items-center justify-between">
          <aside className="flex items-center gap-2">
            <Skeleton height={36} width={196} />
            <Skeleton height={36} width={78} />
          </aside>
          <Skeleton height={36} width={105} />
        </header>
        <Skeleton height={531} className="w-full" />
        <footer className="flex items-center justify-between">
          <Skeleton height={20} width={100} />
          <Skeleton height={36} width={240} />
        </footer>
      </div>
    </SkeletonThemeProvider>
  )
}

export function SkeletonThemeProvider({ children }: { children: ReactNode }) {
  const theme = useThemeStore((state) => state.theme)
  const colors = {
    highlightColor: theme == "dark" ? "#3f3f46" : "#e4e4e7",
    baseColor: theme == "dark" ? "#27272a" : "#f4f4f5",
  }
  return (
    < SkeletonTheme
      highlightColor={colors.highlightColor}
      baseColor={colors.baseColor}
      borderRadius={6}
      enableAnimation
    >
      {children}
    </SkeletonTheme >
  )

}