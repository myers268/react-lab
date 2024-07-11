import { Suspense } from "react";
import { Link, NavLink, Outlet } from "react-router-dom";

import type { ProjectDetails } from "../utils";
import { fetchAllProjects, suspenseFetch } from "../utils";

// const allProjectsQuery = () => ({
//   queryKey: ["projects"],
//   queryFn: async () => fetchAllProjects(),
// });

// export const loader = (queryClient: QueryClient) => async ({}: LoaderFunctionArgs) => {
//   const projectDetails = queryClient.ensureQueryData(allProjectsQuery());

//   return {
//     projectDetails,
//   };
// }

export function ProjectListPage() {
  const getAllProjects = suspenseFetch(fetchAllProjects());

  return (
    <div className="grid grid-cols-[auto_1fr] gap-16 p-4">
      <div className="flex flex-col gap-1 border border-gray-500 rounded p-2 h-64 w-48">
        <h1 className="text-2xl font-medium underline">
          <Link to="/projects">My Projects</Link>
        </h1>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectList getAllProjects={getAllProjects} />
        </Suspense>
      </div>
      <Outlet />
    </div>
  );
}

type ProjectListProps = {
  getAllProjects: () => ProjectDetails[];
};

function ProjectList(props: ProjectListProps) {
  const data = props.getAllProjects();

  return (
    <ul className="flex flex-col gap-1">
      {data.map((project) => (
        <li key={project.id}>
          <NavLink className="[&.active]:text-blue-600" to={project.id}>
            {project.name}
          </NavLink>
        </li>
      ))}
    </ul>
  );
}
