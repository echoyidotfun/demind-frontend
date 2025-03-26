import { SwapForm } from "@/components/swap/SwapForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "trade on DeMind",
  description: "trade like you speak",
};
export default function SwapPage() {
  return <SwapForm />;
}
