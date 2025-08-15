import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useSeo } from "@/hooks/use-seo";
import { memo } from "react";

export function Dashboard() {

  useSeo({
    title: "Plune - Dashboard",
    description: "Página de dashboard para métricas dos dados",
    ogDescription: "Página de dashboard para métricas dos dados",
    ogTitle: "Plune - Dashboard"
  });

  return (
    <ScreenWrapper>
      <div className="grid grid-cols-3 gap-4">
        <DashboardCard title="Instances running" description="" key="" value="" />
        <DashboardCard title="Templates created" description="" key="" value=""/>
        <DashboardCard title="Forms submited" description="" key="" value=""/>
      </div>
    </ScreenWrapper>
  )
}
interface DashboardCardProps {
  title: string;
  description: string;
  value: string;
  key: string;
}
const DashboardCard = memo(({ description, key, title, value }: DashboardCardProps) => {
  return (
    <Card className="bg-gradient-to-bl from-zinc-700/20 to-zinc-950">
      <CardHeader>
        <CardTitle>
          {title}
        </CardTitle>
        <CardDescription>
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {key} {value}
      </CardContent>
      <CardFooter>

      </CardFooter>
    </Card>
  )
})