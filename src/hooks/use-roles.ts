import type { OrganizationRole, Roles } from "@/@types/user"
import { useCallback } from "react"

export function useRoles() {

  const canEdit = useCallback((userRole: OrganizationRole) => {
    return userRole.role.includes("Admin" as Roles) || userRole.role.includes("Editor"as Roles)
  }, []);


  return {
    canEdit
  }
}