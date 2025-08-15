import { Demo } from "@/components/Demo";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import React from "react";

export const Home: React.FC = () => {
  return (
    <>
      <Header />
      <Hero />
      <Features />
      <Demo />
      <Pricing />
      <Footer />
    </>

  )
}