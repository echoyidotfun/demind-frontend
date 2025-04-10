import {
  getNativeAssetAddress,
  getNetworkConfig,
} from "@/lib/configs/app.config";
import { GlobalChain } from "@/lib/services/api/magpie/api.types";
import { bn } from "@/lib/utils/numbers";
import { HumanAmount } from "@balancer/sdk";
import {
  Address,
  Log,
  erc20Abi,
  formatUnits,
  parseAbiItem,
  parseEventLogs,
} from "viem";
import { HumanTokenAmount } from "@/lib/modules/tokens/token.types";
import { emptyAddress } from "@/lib/modules/web3/contracts/wagmi-helpers";
import { GlobalToken } from "@/lib/modules/tokens/token.types";

type ParseProps = {
  receiptLogs: Log[];
  chain: GlobalChain;
  userAddress?: Address;
  txValue: bigint;
  getToken: (address: Address, chain: GlobalChain) => GlobalToken | undefined;
};

export type ParseReceipt = typeof parseSwapReceipt;

export function parseSwapReceipt({
  receiptLogs,
  userAddress,
  chain,
  getToken,
  txValue,
}: ParseProps) {
  /**
   * GET SENT AMOUNT
   */
  const nativeAssetSent = txValue;

  const outgoingData = getOutgoingLogs(receiptLogs, userAddress)[0];
  const sentTokenValue = outgoingData?.args?.value || 0n;
  const sentTokenAddress = outgoingData?.address;
  const sentToken = sentTokenAddress
    ? getToken(sentTokenAddress, chain)
    : undefined;

  const sentHumanAmountWithAddress: HumanTokenAmount =
    bn(sentTokenValue).gt(0) && sentTokenAddress
      ? _toHumanAmount(
          sentTokenAddress,
          outgoingData?.args?.value,
          sentToken?.decimals
        )
      : bn(nativeAssetSent).gt(0)
        ? _toHumanAmount(getNativeAssetAddress(chain), nativeAssetSent, 18)
        : { tokenAddress: emptyAddress, humanAmount: "0" as HumanAmount };

  /**
   * GET RECEIVED AMOUNT
   */
  const nativeAssetReceived =
    (getIncomingWithdrawals(receiptLogs, chain, userAddress) as bigint) || 0n;

  const incomingData = getIncomingLogs(receiptLogs, userAddress)[0];
  const receivedTokenValue = incomingData?.args?.value || 0n;
  const receivedTokenAddress = incomingData?.address;
  const receivedToken = receivedTokenAddress
    ? getToken(receivedTokenAddress, chain)
    : undefined;

  const receivedHumanAmountWithAddress =
    bn(receivedTokenValue).gt(0) && receivedTokenAddress
      ? _toHumanAmount(
          receivedTokenAddress,
          receivedTokenValue,
          receivedToken?.decimals
        )
      : bn(nativeAssetReceived).gt(0)
        ? _toHumanAmount(getNativeAssetAddress(chain), nativeAssetReceived, 18)
        : { tokenAddress: emptyAddress, humanAmount: "0" as HumanAmount };

  return {
    sentToken: sentHumanAmountWithAddress,
    receivedToken: receivedHumanAmountWithAddress,
  };
}

/*
  rawValue and tokenDecimals should always be valid so we use default values to avoid complex error handling
*/
function _toHumanAmount(
  tokenAddress: Address,
  rawValue = 0n,
  tokenDecimals = 18
): HumanTokenAmount {
  const humanAmount = formatUnits(rawValue, tokenDecimals) as `${number}`;
  return { tokenAddress: tokenAddress, humanAmount: humanAmount };
}

function getOutgoingLogs(logs: Log[], userAddress?: Address) {
  if (!userAddress) return [];
  return parseEventLogs({
    abi: erc20Abi,
    logs: logs,
    eventName: "Transfer",
    args: {
      from: userAddress,
    },
  });
}

function getIncomingLogs(logs: Log[], userAddress?: Address) {
  if (!userAddress) return [];
  return parseEventLogs({
    abi: erc20Abi,
    logs: logs,
    eventName: "Transfer",
    args: {
      to: userAddress,
    },
  });
}

function getIncomingWithdrawals(
  logs: Log[],
  chain: GlobalChain,
  userAddress?: Address
) {
  if (!userAddress) return [];
  const networkConfig = getNetworkConfig(chain);

  const from = networkConfig.contracts.balancer.vaultV2;

  // Catches when the wNativeAsset is withdrawn from the vault, assumption is
  // that his means the user is getting the same value in the native asset.
  return parseEventLogs({
    abi: [parseAbiItem("event Withdrawal(address indexed src, uint256 wad)")],
    args: { src: from },
    logs: logs,
  })[0]?.args?.wad;
}
