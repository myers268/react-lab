import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createBrowserRouter,
  LoaderFunctionArgs,
  RouterProvider,
} from "react-router-dom";

import { ProjectListPage, loader as projectListLoader } from "./project-list";

const queryClient = new QueryClient();

type LazyRouteParams<T> = {
  Component: () => JSX.Element;
  loader: (
    queryClient: QueryClient
  ) => ({ params }: LoaderFunctionArgs<any>) => Promise<T>;
};

function withQueryClient<T>({ Component, loader }: LazyRouteParams<T>) {
  return {
    Component,
    loader: loader(queryClient),
  };
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "projects",
    loader: projectListLoader(queryClient),
    element: <ProjectListPage />,
    children: [
      {
        path: ":projectId",
        lazy: async () => withQueryClient(await import("./project")),
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
