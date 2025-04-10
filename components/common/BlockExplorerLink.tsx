"use client";

import { HStack, Link, Text } from "@chakra-ui/react";
import { GoArrowUpRight } from "react-icons/go";
import { Address } from "viem";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import {
  getBlockExplorerName,
  getBlockExplorerTxUrl,
} from "@/lib/utils/blockExplorer";

type Props = { transactionHash?: Address; chain: GlobalChain };

export function BlockExplorerLink({ chain, transactionHash }: Props) {
  if (!transactionHash) return null;
  return (
    <Link href={getBlockExplorerTxUrl(transactionHash, chain)} target="_blank">
      <HStack color="grayText">
        <Text fontSize="sm" variant="secondary">
          View on {getBlockExplorerName(chain)}
        </Text>
        <GoArrowUpRight size={14} />
      </HStack>
    </Link>
  );
}
