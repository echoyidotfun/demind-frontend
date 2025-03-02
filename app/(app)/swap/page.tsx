import { SwapForm } from "@/components/swap/SwapForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "swap on ReMind",
  description: "swap tokens driven by aggragation router",
};
export default function SwapPage() {
  return <SwapForm />;
}
