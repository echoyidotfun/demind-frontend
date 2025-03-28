import React, { PropsWithChildren } from "react";
import { Footer } from "@/components/navs/Footer";
import { NavBarContainer } from "@/components/navs/NavBarContainer";
import NextTopLoader from "nextjs-toploader";
import { Box } from "@chakra-ui/react";

export function BaseLayout({
  bgsrc = "/images/misc/basic-bg.svg",
  children,
}: PropsWithChildren & { bgsrc?: string }) {
  return (
    <Box
      position="relative"
      _before={{
        content: '""',
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundImage: `url(${bgsrc})`,
        backgroundBlendMode: "overlay",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "scroll",
        filter: "blur(1px) brightness(0.8) contrast(0.9)",
        zIndex: -2,
      }}
      _after={{
        content: '""',
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "url('/images/misc/noise.png')",
        backgroundSize: "250px 250px",
        opacity: 0.2,
        mixBlendMode: "soft-light",
        pointerEvents: "none",
        zIndex: -1,
      }}
    >
      <NextTopLoader color="#7f6ae8" showSpinner={false} />
      <NavBarContainer />
      {children}
      <Footer
        logoType="DeMind"
        title="Where Mind Meets Momentum"
        subTitle="DeMind is your AI companion that enhances trading intents into intelligent actions, powered by aggregated liquidity and momentum-driven strategies."
      />
    </Box>
  );
}
