import { GraphQLClient } from "graphql-request";

export const GRAPH_API_URL = process.env.NEXT_PUBLIC_GRAPH_API_URL || "";
export const GRAPH_API_HEADERS = {
  Authorization: process.env.NEXT_PUBLIC_GRAPH_API_KEY || "",
};

export const graphqlClient = new GraphQLClient(GRAPH_API_URL, {
  headers: GRAPH_API_HEADERS,
});
