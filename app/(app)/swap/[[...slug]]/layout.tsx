import { PropsWithChildren } from "react";
import SwapLayout from "../layouts/SwapLayout";
import { SwapProviderProps } from "@/lib/modules/swap/SwapProvider";
import { getSwapPathParams } from "@/components/swap/getSwapPathParams";
import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Trade",
  description: "trade like you speak",
};

type Props = PropsWithChildren<{
  params: { slug?: string[] };
}>;

export default async function Layout({ params, children }: Props) {
  const { slug } = await params;
  const pathParams = getSwapPathParams(slug);
  const swapProps: SwapProviderProps = {
    pathParams,
  };
  return (
    <DefaultPageContainer bg="bg-gray-100" className="min-h-screen">
      <SwapLayout props={swapProps}>{children}</SwapLayout>
    </DefaultPageContainer>
  );
}
