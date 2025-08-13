"use client"

import { memo, ReactNode, useId, useState } from "react"
import { CircleAlertIcon, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "./input"
export type Action = (...args: any[]) => void
export interface ConfirmationDialogProps {
  confirmationName: string;
  alertDialogTrigger: ReactNode;
  action: Action;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  subject?: string;
  isPending?: boolean;
}
export default function ConfirmationDialog(props: ConfirmationDialogProps) {
  return (
    <Dialog modal={false} open={props.open} onOpenChange={props.setOpen}>
      {props.alertDialogTrigger}
      <ConfirmationDialogContent {...props} />
    </Dialog>
  )
}

export const ConfirmationDialogContent = memo(({
  action,
  confirmationName,
  isPending,
  subject,
}: Pick<ConfirmationDialogProps, "action" | "confirmationName"|"isPending"|"subject">) => {
  const id = useId()
  const [inputValue, setInputValue] = useState("")

  return (
    <DialogContent>
      <div className="flex flex-col items-center gap-2">
        <div
          className="flex size-9 shrink-0 items-center justify-center rounded-full border"
          aria-hidden="true"
        >
          <CircleAlertIcon className="opacity-80" size={16} />
        </div>
        <DialogHeader>
          <DialogTitle className="sm:text-center">
            Final confirmation
          </DialogTitle>
          <DialogDescription className="sm:text-center">
            This action cannot be undone. To confirm, please enter the {subject} name <span className="text-foreground">{confirmationName}</span>.
          </DialogDescription>
        </DialogHeader>
      </div>

      <form className="space-y-5">
        <div className="*:not-first:mt-2">
          <Label htmlFor={id}> {subject} name</Label>
          <Input
            id={id}
            type="text"
            placeholder={`Type ${confirmationName} to confirm`}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" className="flex-1">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={action}
            type="button"
            className="flex-1"
            disabled={inputValue !== confirmationName || isPending}
          >
            Delete {isPending && <Loader2 size={15} className="animate-spin" />}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  )
})
