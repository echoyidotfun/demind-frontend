import { PropsWithChildren } from "react";
import SwapLayout from "./layouts/SwapLayout";
import { SwapProviderProps } from "@/lib/modules/swap/SwapProvider";
import { getSwapPathParams } from "@/components/swap/getSwapPathParams";
import { DefaultPageContainer } from "@/components/common/containers/DefaultPageContainer";

type Props = PropsWithChildren<{
  params: { slug?: string[] };
}>;

export default function Layout({ params: { slug }, children }: Props) {
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
