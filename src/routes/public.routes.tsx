import App from "@/App";
import { LandingPageLayout } from "@/layouts/landing-page-layout";
import { Downloads } from "@/pages/Downloads";
import { Home } from "@/pages/home";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const PublicRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<LandingPageLayout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Downloads />} path="/downloads" />
      </Route>
    </Routes>
  )
} 