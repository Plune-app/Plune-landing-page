import { BrowserRouter } from "react-router-dom"
import { OrganizationRouter } from "./organization.routes";
import { PublicRouter } from "./public.routes";
import { useUserStore } from "@/store/user";
export function Router () {
  //validar existencia de usuario cliente para usar apenas a aplicação onde é possivel realizar submissoes de formulários
  const user = useUserStore((state) => state.user);
  return (
    <BrowserRouter>   
      { user ? <OrganizationRouter /> : <PublicRouter /> }
    </BrowserRouter>
  )
}