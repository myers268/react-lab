import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { ProjectPage } from "./project";
import { ProjectListPage } from "./project-list";

const queryClient = new QueryClient();

// type LazyRouteParams<T> = {
//   Component: () => JSX.Element;
//   loader: (queryClient: QueryClient) => ({ params }: LoaderFunctionArgs<any>) => Promise<T>
// }

// function withQueryClient<T>({ Component, loader }: LazyRouteParams<T>) {
//   return {
//     Component,
//     loader: loader(queryClient),
//   }
// }

const router = createBrowserRouter([
  {
    path: "/",
    element: <div>Hello world!</div>,
  },
  {
    path: "projects",
    element: <ProjectListPage />,
    children: [
      {
        path: ":projectId",
        element: <ProjectPage />,
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
