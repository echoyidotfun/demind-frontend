import { isArray } from "lodash";

const magpieTokenApi =
  process.env.NEXT_PUBLIC_MAGPIE_TOKENS_API ||
  "https://api.magpiefi.xyz/token-manager/tokens";

export async function POST(request: Request) {
  const postBody = await request.json();

  const response = await fetch(magpieTokenApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  });

  if (!response.ok) {
    return new Response("Failed to fetch tokens", { status: 500 });
  }

  const data = await response.json();
  if (!isArray(data)) {
    return new Response("Invalid response", { status: 500 });
  }
  return new Response(JSON.stringify(data));
}
