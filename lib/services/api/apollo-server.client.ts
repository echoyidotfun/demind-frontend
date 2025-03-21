import { config } from "@/lib/configs/app.config";
import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { registerApolloClient } from "@apollo/experimental-nextjs-app-support";

const defaultHeaders = {
  "x-graphql-client-name": "FrontendClient",
  "x-graphql-client-version": "1.0.0",
};

export const { getClient: getApolloServerClient } = registerApolloClient(() => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    link: new HttpLink({
      uri: config.apiUrl,
      headers: defaultHeaders,
    }),
  });
});
