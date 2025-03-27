import { PropsWithChildren } from "react";
import { Footer } from "@/components/navs/Footer";
import { NavBarContainer } from "@/components/navs/NavBarContainer";
import NextTopLoader from "nextjs-toploader";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "DeMind - Where Mind Meets Momentum",
  description:
    "DeMind is your AI companion that enhances trading intents into intelligent actions, powered by aggregated liquidity and momentum-driven strategies.",
};

export default function LandingLayout({ children }: PropsWithChildren) {
  return (
    <div
      style={{
        backgroundImage: "url(/images/misc/16358469_rm309-aew-014-a.svg)",
        backgroundBlendMode: "overlay",
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
        title="Where Mind Meets Momentum"
        subTitle="DeMind is your AI companion that enhances trading intents into intelligent actions, powered by aggregated liquidity and momentum-driven strategies."
      />
    </div>
  );
}
