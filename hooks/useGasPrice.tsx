import { useQuery } from "@tanstack/react-query";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { getViemClient } from "@/lib/services/viem/viem.client";
import { formatUnits } from "viem";
import { bn, fNum } from "@/lib/utils/numbers";
import { secs } from "@/lib/utils/time";
import {
  Box,
  Button,
  HStack,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { GasIcon } from "@/components/common/icons/GasIcon";
import { onlyExplicitRefetch } from "@/lib/utils/queries";

function getGasPrice(chain: GlobalChain) {
  const client = getViemClient(chain);
  return client.getGasPrice();
}

function formatGasPrice(gasPrice: bigint): string {
  return fNum("fiat", formatUnits(gasPrice, 9));
}

function highGasPriceFor(chain: GlobalChain) {
  if (chain === GlobalChain.Ethereum) return 50;
  return 500;
}

export function GasPriceCard({
  chain,
  inConnectWallect = false,
}: {
  chain: GlobalChain;
  inConnectWallect?: boolean;
}) {
  const { gasPrice, isHighGasPrice } = useGasPriceQuery(chain);

  const gasPriceColor = isHighGasPrice ? "red.500" : "grayText";
  const gasPriceTrackerColor = isHighGasPrice ? "red.500" : "purple.300";

  if (inConnectWallect) {
    return (
      <Popover trigger="hover">
        <PopoverTrigger>
          <Button
            alignItems="center"
            display="flex"
            color={gasPriceTrackerColor}
            variant="tertiary"
            cursor="default"
          >
            <HStack spacing="xs">
              <GasIcon size={16} />
              <Text
                color={gasPriceTrackerColor}
                fontSize="sm"
                fontWeight="bold"
              >
                {gasPrice ? gasPrice.toString() : "-"}
              </Text>
            </HStack>
          </Button>
        </PopoverTrigger>
        <PopoverContent p="sm" w="fit-content">
          <HStack>
            <Text variant="primary" fontSize="sm">
              {`Gas Price on ${chain}:`}
            </Text>
            <Text color={gasPriceTrackerColor} fontSize="sm">
              {` ${gasPrice} Gwei`}
            </Text>
          </HStack>
        </PopoverContent>
      </Popover>
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

export function useGasPriceQuery(chain: GlobalChain) {
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
