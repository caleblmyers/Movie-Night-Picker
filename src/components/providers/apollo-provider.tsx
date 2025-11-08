"use client";

import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { ReactNode } from "react";
import { getGraphQLUrl, AUTH_TOKEN_KEY } from "@/lib/config";

const httpLink = new HttpLink({
  uri: getGraphQLUrl(),
});

// Auth link to add JWT token to requests
const authLink = setContext((_, { headers }) => {
  // Get token from localStorage (set by login/register)
  const token = typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;
  
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache(),
});

export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
