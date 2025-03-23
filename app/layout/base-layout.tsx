import React, { PropsWithChildren } from "react";
import { Footer } from "@/components/navs/Footer";
import { NavBarContainer } from "@/components/navs/NavBarContainer";
import NextTopLoader from "nextjs-toploader";

export function BaseLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundImage: "url(/images/misc/pattern-sml-7@2x.webp)",
        backgroundSize: "8%",
      }}
    >
      <NextTopLoader color="#7f6ae8" showSpinner={false} />
      <NavBarContainer />
      {children}
      <Footer
        logoType={<img src="/next.svg" alt="logo" width={180} height={30} />}
        title="Trade Like You Speak"
        subTitle="Where aggregated liquidity meets artificial intelligence, creating seamless trading experiences with the power of natural language commands."
      />
    </div>
  );
}
