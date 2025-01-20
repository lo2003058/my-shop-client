export interface GraphQLErrorDetail {
  message: string;

  [key: string]: unknown;
}

export interface GqlErrorMessage {
  // Apollo often provides a 'graphQLErrors' array of objects
  graphQLErrors?: GraphQLErrorDetail[];

  // A generic message string (e.g., the error's top-level message)
  message?: string;

  // If there's a network-level error, it can appear here
  networkError?: unknown;

  // Optionally include any other properties you want to capture
  [key: string]: unknown;
}
