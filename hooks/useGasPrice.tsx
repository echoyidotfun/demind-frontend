import { useQuery } from "@tanstack/react-query";
import { GqlChain } from "@/lib/services/api/generated/graphql";
import { getViemClient } from "@/lib/services/viem/viem.client";
import { formatUnits } from "viem";
import { bn, fNum } from "@/lib/utils/numbers";
import { secs } from "@/lib/utils/time";
import { Box, Button, HStack, Link, Text } from "@chakra-ui/react";
import { GasIcon } from "@/components/common/icons/GasIcon";
import { onlyExplicitRefetch } from "@/lib/utils/queries";
import { injectedWallet } from "@rainbow-me/rainbowkit/wallets";

function getGasPrice(chain: GqlChain) {
  const client = getViemClient(chain);
  return client.getGasPrice();
}

function formatGasPrice(gasPrice: bigint): string {
  return fNum("fiat", formatUnits(gasPrice, 9));
}

function highGasPriceFor(chain: GqlChain) {
  if (chain === GqlChain.Mainnet) return 50;
  return 500;
}

export function GasPriceCard({
  chain,
  inConnectWallect = false,
}: {
  chain: GqlChain;
  inConnectWallect?: boolean;
}) {
  const { gasPrice, isHighGasPrice } = useGasPriceQuery(chain);

  const gasPriceColor = isHighGasPrice
    ? "red.500"
    : inConnectWallect
      ? "green.200"
      : "grayText";

  if (inConnectWallect) {
    return (
      <Button
        alignItems="center"
        display="flex"
        variant="tertiary"
        color={gasPriceColor}
      >
        <HStack spacing="xs">
          <GasIcon size={16} />
          <Text color={gasPriceColor} fontSize="sm" fontWeight="bold">
            {gasPrice ? gasPrice.toString() : "-"}
          </Text>
        </HStack>
      </Button>
    );
  }

  return (
    <Box
      background="background.level3"
      color={gasPriceColor}
      p="xs"
      rounded="sm"
      shadow="sm"
    >
      <HStack spacing="xs">
        <GasIcon size={16} />
        <Text color={gasPriceColor} fontSize="xs" fontWeight="bold">
          {gasPrice ? gasPrice.toString() : "-"}
        </Text>
      </HStack>
    </Box>
  );
}

export function useGasPriceQuery(chain: GqlChain) {
  const query = useQuery({
    queryKey: ["gasPrice", chain],
    queryFn: () => getGasPrice(chain),
    refetchInterval: secs(30).toMs(),
    gcTime: secs(30).toMs(),
    ...onlyExplicitRefetch,
  });

  const gasPrice = query.data ? formatGasPrice(query.data) : undefined;

  const isHighGasPrice = gasPrice
    ? bn(gasPrice).gte(highGasPriceFor(chain))
    : false;

  return { ...query, gasPrice, isHighGasPrice };
}
