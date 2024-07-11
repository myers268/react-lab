import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { useParams } from "react-router-dom";
import invariant from "tiny-invariant";

import { ErrorPage } from "./error";
import type { Comment, ProjectDetails } from "../utils";
import { fetchComments, fetchProject, suspenseFetch } from "../utils";

// const projectDetailsQuery = (id: string) => ({
//   queryKey: ["projects", "details", id],
//   queryFn: async () => fetchProject(id),
// });

// const projectCommentsQuery = (id: string) => ({
//   queryKey: ["projects", "comments", id],
//   queryFn: async () => fetchComments(id),
// });

// export const loader = (queryClient: QueryClient) => async ({ params }: LoaderFunctionArgs) => {
//   invariant(params.projectId, "Could not parse projectId from URL");
//   const projectDetails = queryClient.ensureQueryData(projectDetailsQuery(params.projectId));
//   const comments = queryClient.ensureQueryData(projectCommentsQuery(params.projectId));

//   return {
//     projectDetails,
//     comments,
//   };
// }

export function ProjectPage() {
  const params = useParams<{ projectId: string }>();
  invariant(params.projectId, "Could not parse projectId from URL");

  const getProjectDetails = suspenseFetch(fetchProject(params.projectId));
  const getComments = suspenseFetch(fetchComments(params.projectId));

  return (
    <div className="flex flex-col gap-4">
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDetails getProjectDetails={getProjectDetails}>
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectComments getComments={getComments} />
              </Suspense>
            </ErrorBoundary>
          </ProjectDetails>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

type ProjectDetailsProps = {
  getProjectDetails: () => ProjectDetails;
  children?: ReactNode;
};

function ProjectDetails(props: ProjectDetailsProps) {
  const data = props.getProjectDetails();

  return (
    <>
      <div>
        <h2 className="text-xl font-medium">{data.name}</h2>
        <div>{data.description}</div>
      </div>

      {props.children}
    </>
  );
}

type ProjectCommentsProps = {
  getComments: () => Comment[];
};

function ProjectComments(props: ProjectCommentsProps) {
  const data = props.getComments();

  return (
    <div>
      <h3 className="text-lg font-medium">Comments</h3>
      <ul>
        {data.map((comment) => (
          <li key={comment.id}>{comment.message}</li>
        ))}
      </ul>
    </div>
  );
}
