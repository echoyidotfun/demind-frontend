import { SentryError } from "@/lib/utils/errors";

export function ensureLastQueryResponse<Q>(
  liquidityActionDescription: string,
  queryResponse?: Q
): Q {
  if (!queryResponse) {
    // This should never happen but this is a check against potential regression bugs
    console.error(`Missing queryResponse in ${liquidityActionDescription}`);
    throw new SentryError(
      `Missing queryResponse.
  It looks that you tried to call useBuildCallData before the last query finished generating queryResponse`
    );
  }

  return queryResponse;
}
