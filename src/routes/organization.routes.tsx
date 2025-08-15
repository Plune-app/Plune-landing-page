import { OrganizationLayout } from "@/layouts/organization-layout";
import { Organization } from "@/pages/app/tenant-viewer-subdomain/Organization";
import { NotFound } from "@/pages/notfound";
import { useUserStore } from "@/store/user";
import React, { useEffect } from "react";
import { Route, Routes } from "react-router-dom";

export const OrganizationRouter: React.FC = () => {
  const selectedOrganization = useUserStore((state) => state.selectedOrganization);
  const shouldRedirectToSubdomain = selectedOrganization && selectedOrganization.role == "Viewer";

  useEffect(() => {
    if(shouldRedirectToSubdomain) {

    }
  }, [shouldRedirectToSubdomain])

  return (
    <Routes>
      <Route element={<OrganizationLayout />} path="/">
        <Route path="/" element={< Organization />} />
        <Route path="*" element={<NotFound />}/>
      </Route>
    </Routes>
  )
}