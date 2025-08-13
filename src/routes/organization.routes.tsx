import { OrganizationLayout } from "@/layouts/organization-layout";
import { Organization } from "@/pages/organization";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const OrganizationRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<OrganizationLayout />} path="/">
        <Route path="/" element={< Organization />} />
      </Route>
    </Routes>
  )
}