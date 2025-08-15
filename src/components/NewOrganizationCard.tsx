import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Organization } from "@/@types/Organization";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { memo, ReactNode } from "react";
import { OrganizationForm } from "./forms/OrganizationForm";
interface NewOrganizationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  organization?: Organization;
}
export const NewOrganizationCard = memo(({ open, organization, setOpen }: NewOrganizationProps) => {
  return (
    <Card className="h-full ">
      <CardContent className="h-full flex flex-col gap-5 items-start justify-between">
        <CardTitle className="text-muted-foreground">
          New Organization
        </CardTitle>
        <NewOrganizationDialog
          open={open}
          setOpen={setOpen}
          organization={organization}
        />
      </CardContent>
    </Card>
  )
})


export const NewOrganizationDialog = memo(({ open, setOpen, organization, trigger }: NewOrganizationProps & { trigger?: ReactNode }) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        trigger
      ) : (
        <DialogTrigger asChild>
          <Button className="w-full" size={"lg"} variant={"outline"}>
            <Plus size={20} />
          </Button>
        </DialogTrigger >
      )}
      <DialogContent >
        <DialogTitle>
          {organization ? "Edit organization" : "New Organization"}
        </DialogTitle>
        <DialogDescription>
          Invite some users to participate with
        </DialogDescription>
        <OrganizationForm organization={organization} />
      </DialogContent>
    </Dialog >
  )
})