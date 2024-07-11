import { QueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { LoaderFunctionArgs, useParams } from "react-router-dom";
import invariant from "tiny-invariant";

import { ErrorPage } from "./error";
import { fetchComments, fetchProject } from "../utils";

export const projectDetailsQuery = (id: string) => ({
  queryKey: ["projects", "details", id],
  queryFn: async () => fetchProject(id),
});

export const projectCommentsQuery = (id: string) => ({
  queryKey: ["projects", "comments", id],
  queryFn: async () => fetchComments(id),
});

export const loader =
  (queryClient: QueryClient) =>
  async ({ params }: LoaderFunctionArgs) => {
    invariant(params.projectId, "Could not parse projectId from URL");
    const projectDetails = queryClient.ensureQueryData(
      projectDetailsQuery(params.projectId)
    );
    const comments = queryClient.ensureQueryData(
      projectCommentsQuery(params.projectId)
    );

    return {
      projectDetails,
      comments,
    };
  };

export function Component() {
  const params = useParams<{ projectId: string }>();
  invariant(params.projectId, "Could not parse projectId from URL");

  return (
    <div className="flex flex-col gap-4">
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<div>Loading...</div>}>
          <ProjectDetails id={params.projectId}>
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <Suspense fallback={<div>Loading...</div>}>
                <ProjectComments id={params.projectId} />
              </Suspense>
            </ErrorBoundary>
          </ProjectDetails>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

type ProjectDetailsProps = {
  id: string;
  children?: ReactNode;
};

function ProjectDetails(props: ProjectDetailsProps) {
  const { data } = useSuspenseQuery(projectDetailsQuery(props.id));

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
  id: string;
};

function ProjectComments(props: ProjectCommentsProps) {
  const { data } = useSuspenseQuery(projectCommentsQuery(props.id));

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
