/**
 *  1. Observe data loading behavior (fetch on render).
 *  2. Add component-level fetching to the Comments component and uncomment the list items.
 *  3. Render Comments component below Project component; observe loading behavior.
 *  4. Move Comments component to be a child of the Project component; observe loading behavior.
 *  5. Adjust the error rate of any fetch operation to observe error states; reset to 0 when finished.
 *  6. Move both `useFetch` calls to the App component, passing `isLoading`, `error`, and `data` props to their respective components; observe loading behavior (fetch then render).
 *  7. Replace each instance of `useFetch` with `suspenseFetch`, assigning each result to a getter function.
 *     Example:
 *       const getProjectDetails = suspenseFetch(fetchProject(id));
 *  8. Pass getter functions as props to their respective components; in each component, execute the getter function and assign the results to a `data` variable.
 *     Example:
 *       const data = props.getProjectDetails();
 *  9. Remove `isLoading` and `error` checks.
 * 10. Wrap the Project component in a Suspense component and pass the Loading component as an element to its `fallback` prop; observe loading behavior (render as you fetch).
 * 11. Repeat the previous step, except instead of wrapping the Project component in a Suspense boundary, wrap the Comments component in one; observe loading behavior.
 * 12. Wrap each Suspense boundary with an ErrorBoundary component and pass the Error component to its `FallbackComponent` prop (Note: do not pass the Error component as an element as done with the Suspense component).
 * 13. Adjust the error rate of any fetch operation to observe error states; reset to 0 when finished.
 * 14. Compose the Project, Comments, Suspense, and ErrorBoundary components however you please, observing how changes affect loading and error states.
 * 15. Bonus: Observe differences between `useFetch` hook and `suspenseFetch` function.
 */

import { ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";

import type { Comment, ProjectDetails } from "./utils";
import { fetchComments, fetchProject, suspenseFetch, useParams } from "./utils";

export function App() {
  const { id } = useParams();

  const getProjectDetails = suspenseFetch(fetchProject(id));
  const getComments = suspenseFetch(fetchComments(id));

  return (
    <div className="flex flex-col gap-4 w-64 mx-auto">
      <h1 className="text-2xl font-medium">My Projects</h1>
      <ErrorBoundary FallbackComponent={ErrorPage}>
        <Suspense fallback={<Loading />}>
          <Project getProjectDetails={getProjectDetails}>
            <ErrorBoundary FallbackComponent={ErrorPage}>
              <Suspense fallback={<Loading />}>
                <Comments getComments={getComments} />
              </Suspense>
            </ErrorBoundary>
          </Project>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

type ProjectProps = {
  getProjectDetails: () => ProjectDetails;
  children?: ReactNode;
};

function Project(props: ProjectProps) {
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

type CommentsProps = {
  getComments: () => Comment[];
};

function Comments(props: CommentsProps) {
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

type ErrorPageProps = {
  error: Error;
};

function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="text-red-700 bg-red-200 p-1 border border-solid border-red-500">
      {props.error.message}
    </div>
  );
}

function Loading() {
  return <div>Loading...</div>;
}
