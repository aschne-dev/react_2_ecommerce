import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

export function renderWithQueryClient(ui, { queryClient } = {}) {
  const client = queryClient ?? createTestQueryClient();
  return {
    ...render(
      <QueryClientProvider client={client}>{ui}</QueryClientProvider>
    ),
    queryClient: client,
  };
}
