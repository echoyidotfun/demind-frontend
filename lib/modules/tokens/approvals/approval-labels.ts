import { BuildTransactionLabels } from "@/lib/modules/web3/contracts/transactionLabels";

export type ApprovalAction = "Swapping" | "Unapprove" | "Unwrapping";

export type TokenApprovalLabelArgs = {
  actionType: ApprovalAction;
  symbol: string;
  requiredRawAmount: bigint;
  isPermit2?: boolean;
  lpToken?: string;
};

export const buildTokenApprovalLabels: BuildTransactionLabels = ({
  actionType,
  symbol,
}: TokenApprovalLabelArgs) => {
  return {
    init: initApprovalLabelFor(actionType, symbol),
    title: titleFor(symbol),
    description: descriptionFor(actionType, symbol),
    confirming:
      actionType === "Unapprove"
        ? `Unapproving ${symbol}...`
        : `Approving ${symbol}...`,
    confirmed: `${symbol} ${
      actionType === "Unapprove" ? "unapproved" : "approved!"
    }`,
    tooltip: tooltipApprovalLabelFor(actionType, symbol),
    error: `Error ${
      actionType === "Unapprove" ? "unapproving" : "approving"
    } ${symbol}`,
  };
};

function initApprovalLabelFor(actionType: ApprovalAction, symbol: string) {
  switch (actionType) {
    case "Swapping":
      return `Approve ${symbol} to swap`;
    case "Unapprove":
      return `Unapprove ${symbol}`;
    case "Unwrapping":
      return `Approve ${symbol} to unwrap`;
    default:
      return `Approve ${symbol}`;
  }
}

function titleFor(symbol: string) {
  return `Approve ${symbol}`;
}
function descriptionFor(actionType: ApprovalAction, symbol: string) {
  switch (actionType) {
    case "Swapping":
      return `Approval of ${symbol} to swap`;
    case "Unapprove":
      return `Unapprove ${symbol}`;
    case "Unwrapping":
      return `Approval of ${symbol} to unwrap`;
    default:
      return `Approve ${symbol}`;
  }
}

function tooltipApprovalLabelFor(actionType: ApprovalAction, symbol: string) {
  switch (actionType) {
    case "Swapping":
      return `You must approve ${symbol} to swap this token. Approvals are required once per token, per wallet.`;
    case "Unapprove":
      return `You must unapprove ${symbol} before a new approval value can be set.`;
    case "Unwrapping":
      return `You must approve ${symbol} to unwrap this token. Approvals are required once per token, per wallet.`;
    default:
      return `You must approve ${symbol} to use this token. Approvals are required once per token, per wallet.`;
  }
}
