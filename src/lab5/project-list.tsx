import {
  QueryClient,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { Suspense } from "react";
import { Link, LoaderFunctionArgs, NavLink, Outlet } from "react-router-dom";

import { fetchAllProjects } from "../utils";

const allProjectsQuery = () => ({
  queryKey: ["projects"],
  queryFn: async () => fetchAllProjects(),
});

export const loader =
  (queryClient: QueryClient) =>
  async ({}: LoaderFunctionArgs) => {
    const projectDetails = queryClient.ensureQueryData(allProjectsQuery());

    return {
      projectDetails,
    };
  };

export function ProjectListPage() {
  return (
    <div className="grid grid-cols-[auto_1fr] gap-16 p-4">
      <div className="flex flex-col gap-1 border border-gray-500 rounded p-2 h-64 w-48">
        <h1 className="text-2xl font-medium underline">
          <Link to="/projects">My Projects</Link>
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectList />
        </Suspense>
      </div>
      <Outlet />
    </div>
  );
}

function ProjectList() {
  const { data } = useSuspenseQuery(allProjectsQuery());
  const queryClient = useQueryClient();

  return (
    <ul className="flex flex-col gap-1">
      {data.map((project) => (
        <li key={project.id}>
          <NavLink
            className="[&.active]:text-blue-600"
            to={project.id}
            onMouseOver={async () => {
              const { projectDetailsQuery, projectCommentsQuery } = await import("./project");
              await queryClient.ensureQueryData(projectDetailsQuery(project.id));
              await queryClient.ensureQueryData(projectCommentsQuery(project.id));
            }}
          >
            {project.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
