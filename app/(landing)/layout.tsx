import { PropsWithChildren } from "react";
import { Metadata } from "next";
import { BaseLayout } from "../layout/base-layout";

export const metadata: Metadata = {
  title: "DeMind - Where Mind Meets Momentum",
  description:
    "DeMind is your AI companion that enhances trading intents into intelligent actions, powered by aggregated liquidity and momentum-driven strategies.",
};

export default function LandingLayout({ children }: PropsWithChildren) {
  return (
    <BaseLayout bgsrc="/images/misc/landing-bg.jpg">{children}</BaseLayout>
  );
}
