import { Outlet } from "react-router-dom";

export function AuthLayout() {
  return (
    <main
      className={`w-full h-screen relative flex items-center justify-center bg-white dark:bg-zinc-950 `}
    >
      <div className="w-[400px] mt-7 2xl:h-[70%]">
        <Outlet />
      </div>
    </main>
  )
}