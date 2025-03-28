"use client";

import { Box } from "@chakra-ui/react";
import { LandingHeroImg } from "@/components/landing-page/LandingHeroImg";
import { LandingHeroSection } from "@/components/landing-page/LandingHeroSection";
import { FeaturesSection } from "@/components/landing-page/FeaturesSection";
import { SmoothSection } from "@/components/landing-page/SmoothSection";

export default function Home() {
  return (
    <Box
      as="main"
      minH="100vh"
      bgGradient="linear(to-l, transparent, background.baseWithOpacity 100%)"
    >
      {/* Hero Section */}
      <LandingHeroImg />
      <LandingHeroSection />
      <SmoothSection />
      {/* Features Section */}
      <FeaturesSection />
    </Box>
  );
}
