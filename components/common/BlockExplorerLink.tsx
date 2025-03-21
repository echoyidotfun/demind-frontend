"use client";

import { HStack, Link, Text } from "@chakra-ui/react";
import { GoArrowUpRight } from "react-icons/go";
import { Address } from "viem";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import {
  getBlockExplorerName,
  getBlockExplorerTxUrl,
} from "@/lib/utils/blockExplorer";

type Props = { transactionHash?: Address; chain: GqlChain };

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
