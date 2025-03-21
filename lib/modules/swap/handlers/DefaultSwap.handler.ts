import { ApolloClient } from "@apollo/client";
import { Path } from "@balancer/sdk";
import { SorGetSwapPathsDocument } from "@/lib/services/api/generated/graphql";
import { SdkSimulateSwapResponse, SimulateSwapInputs } from "../swap.types";
import { BaseDefaultSwapHandler } from "./BaseDefaultSwap.handler";
import {
  ensureError,
  isFailedToFetchApolloError,
  swapApolloNetworkErrorMessage,
} from "@/lib/utils/errors";

export class DefaultSwapHandler extends BaseDefaultSwapHandler {
  name = "DefaultSwapHandler";

  constructor(public apolloClient: ApolloClient<object>) {
    super();
  }

  async simulate({
    ...variables
  }: SimulateSwapInputs): Promise<SdkSimulateSwapResponse> {
    const { data } = await this.apolloClient
      .query({
        query: SorGetSwapPathsDocument,
        variables: { ...variables },
        fetchPolicy: "no-cache",
        notifyOnNetworkStatusChange: true,
      })
      .catch((e) => {
        const error = ensureError(e);
        if (isFailedToFetchApolloError(error)) {
          throw new Error(swapApolloNetworkErrorMessage, { cause: error });
        }
        throw error;
      });

    const hopCount: number = data.swaps.routes[0]?.hops?.length || 0;
    const paths = data.swaps.paths.map(
      (path) =>
        ({
          ...path,
          inputAmountRaw: BigInt(path.inputAmountRaw),
          outputAmountRaw: BigInt(path.outputAmountRaw),
        } as Path)
    );

    return this.runSimulation({
      protocolVersion: data.swaps.protocolVersion as 1 | 2 | 3,
      paths,
      hopCount,
      swapInputs: variables,
    });
  }
}
