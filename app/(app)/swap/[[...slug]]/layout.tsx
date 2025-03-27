import SwapLayout from "../layouts/SwapLayout";
import { SwapProviderProps } from "@/lib/modules/swap/SwapProvider";
import { getSwapPathParams } from "@/components/swap/getSwapPathParams";
import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";
import { Metadata } from "next";
import { PropsWithChildren } from "react";

export const metadata: Metadata = {
  title: "Trade",
  description: "Where Mind Meets Momentum",
};

export default async function Layout({
  params,
  children,
}: { params: Promise<{ slug: string[] }> } & PropsWithChildren) {
  const { slug } = await params;
  const pathParams = getSwapPathParams(slug);
  const swapProps: SwapProviderProps = {
    pathParams,
  };

  return (
    <DefaultPageContainer className="100vh">
      <SwapLayout props={swapProps}>{children}</SwapLayout>
    </DefaultPageContainer>
  );
}
