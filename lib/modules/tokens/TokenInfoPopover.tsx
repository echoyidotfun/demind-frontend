import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import {
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { Address } from "viem";
import { CopyTokenAddressButton } from "./CopyTokenAddressButton";
import { abbreviateAddress } from "@/lib/utils/addresses";
import { AddTokenToWalletButton } from "./AddTokenToWalletButton";
import { RxExternalLink as ExternalLink } from "react-icons/rx";
import { InfoIcon } from "@/components/common/icons/InfoIcon";
import { useTokens } from "./TokensProvider";
import {
  getBlockExplorerName,
  getBlockExplorerTokenUrl,
} from "@/lib/utils/blockExplorer";

type Props = {
  tokenAddress: string | Address;
  chain: GlobalChain;
  isBpt?: boolean;
};

export function TokenInfoPopover({
  tokenAddress,
  chain,
  isBpt = false,
}: Props) {
  const { getToken } = useTokens();
  const token = getToken(tokenAddress, chain);

  return (
    <Popover arrowSize={12} placement="right" variant="tooltip">
      <PopoverTrigger>
        <IconButton
          _hover={{
            opacity: "1",
          }}
          aria-label="Token info"
          color="grayText"
          h="24px"
          icon={<InfoIcon />}
          isRound
          opacity="0.5"
          size="xs"
          variant="link"
        />
      </PopoverTrigger>
      <PopoverContent w="auto">
        <PopoverArrow bg="background.level2" />
        <PopoverBody>
          <HStack>
            <Text color="inherit" fontSize="sm" fontWeight="medium">
              {abbreviateAddress(tokenAddress)}
            </Text>
            <HStack spacing="xs">
              <CopyTokenAddressButton
                color="inherit"
                tokenAddress={tokenAddress}
              />
              <AddTokenToWalletButton
                chain={chain}
                color="inherit"
                tokenAddress={tokenAddress}
              />
              <Tooltip label={`View on ${getBlockExplorerName(chain)}`}>
                <IconButton
                  aria-label="View on block explorer"
                  as="a"
                  color="grayText"
                  h="6"
                  href={getBlockExplorerTokenUrl(tokenAddress, chain)}
                  icon={<ExternalLink size={12} />}
                  isRound
                  rel="noopener noreferrer"
                  size="xs"
                  target="_blank"
                  variant="ghost"
                  w="6"
                />
              </Tooltip>
            </HStack>
          </HStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
