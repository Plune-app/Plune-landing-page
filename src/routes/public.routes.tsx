import { LandingPageLayout } from "@/layouts/landing-page-layout";
import { Downloads } from "@/pages/public/Downloads";
import { Home } from "@/pages/public/Home";
import { SignIn } from "@/pages/public/SignIn";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const PublicRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<LandingPageLayout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Downloads />} path="/downloads" />
        <Route element={<SignIn />} path="/signIn"/>
      </Route>
    </Routes>
  )
} 