import React, { PropsWithChildren } from "react";
import { Footer } from "@/components/navs/Footer";
import { NavBarContainer } from "@/components/navs/NavBarContainer";
import NextTopLoader from "nextjs-toploader";

export function BaseLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundImage: "url(/images/misc/16358469_rm309-aew-014-a.svg)",
        backgroundBlendMode: "overlay", //
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <NextTopLoader color="#7f6ae8" showSpinner={false} />
      <NavBarContainer />
      {children}
      <Footer
        logoType="DeMind"
        title='"Trade Like You Speak"'
        subTitle="Where aggregated liquidity meets artificial intelligence, creating seamless trading experiences with the power of natural language commands."
      />
    </div>
  );
}
