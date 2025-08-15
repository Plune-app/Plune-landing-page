import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import React from "react"
import { useNavigate } from "react-router-dom"

export const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <article className=" relative flex flex-col gap-4 items-start rounded-lg border-border bg-accent px-4 py-5">
        <h1 className="text-muted-foreground font-bold text-3xl">
          Page not found...
        </h1>
        <span className="text-muted-foreground text-lg">404</span>
        <Button onClick={() => navigate('/')} variant={"outline"} className="cursor-pointer absolute bottom-2 right-2">
          <ArrowLeft />
          go to home
        </Button>
      </article>
    </div>
  )
}