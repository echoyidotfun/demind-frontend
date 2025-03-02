import {
  SwapProvider,
  SwapProviderProps,
} from "@/lib/modules/swap/SwapProvider";
import { PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  props: SwapProviderProps;
}>;

export default function SwapLayout({ props, children }: Props) {
  return <SwapProvider params={props}>{children}</SwapProvider>;
}
