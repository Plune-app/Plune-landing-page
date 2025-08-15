import { AuthLayout } from "@/layouts/auth-layout";
import { LandingPageLayout } from "@/layouts/landing-page-layout";
import { NotFound } from "@/pages/notfound";
import { Downloads } from "@/pages/public/Downloads";
import { Home } from "@/pages/public/Home";
import { SignIn } from "@/pages/public/SignIn";
import { SignUp } from "@/pages/public/SignUp";
import React from "react";
import { Route, Routes } from "react-router-dom";

export const PublicRouter: React.FC = () => {
  return (
    <Routes>
      <Route element={<LandingPageLayout />} path="/">
        <Route element={<Home />} path="/" />
        <Route element={<Downloads />} path="/downloads" />
        <Route element={<AuthLayout />} path="/">
          <Route element={<SignIn />} path="/signIn"/>
          <Route element={<SignUp />} path="/signUp"/>
        </Route>
        <Route path="*" element={<NotFound />}/>
      </Route>
    </Routes>
  )
} 