import { Organization } from "@/pages/organization";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const OrganizationRouter : React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={< Organization />}/>
    </Routes>
  )
}