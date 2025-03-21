import { GqlChain } from "@/lib/services/api/generated/graphql";

type Params = {
  params: {
    chain: string;
  };
};

const DRPC_KEY = process.env.NEXT_PRIVATE_DRPC_KEY;
const dRpcUrl = (chainName: string) =>
  `https://${chainName}.g.alchemy.com/v2/${DRPC_KEY}`;

const chainToRpcMap: Record<GqlChain, string | undefined> = {
  [GqlChain.Mainnet]: dRpcUrl("eth-mainnet"),
  [GqlChain.Base]: dRpcUrl("base-mainnet"),
  [GqlChain.Sepolia]: dRpcUrl("eth-sepolia"),
  [GqlChain.Sonic]: dRpcUrl("sonic-mainnet"),
  [GqlChain.Arbitrum]: dRpcUrl("arb-mainnet"),
};

function getRpcUrl(chain: string) {
  try {
    const rpc = chainToRpcMap[chain as GqlChain];
    if (!rpc) throw new Error(`Invalid chain: ${chain}`);
    return rpc;
  } catch (error) {
    throw new Error(`Invalid chain: ${chain}`);
  }
}

export async function POST(request: Request, { params }: Params) {
  if (!DRPC_KEY) {
    return new Response(
      JSON.stringify({ error: "NEXT_PRIVATE_DRPC_KEY is missing" }),
      {
        status: 500,
      }
    );
  }

  const { chain } = await params;
  const rpcUrl = getRpcUrl(chain);
  const rpcBody = await request.json();

  const rpcResponse = await fetch(rpcUrl, {
    method: "POST",
    body: JSON.stringify(rpcBody),
    next: {
      revalidate: 0,
    },
  });

  const rpcResponseJson = await rpcResponse.json();

  return Response.json(rpcResponseJson);
}
