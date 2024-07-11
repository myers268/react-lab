# Part I - Caching query results
 1. Navigate between projects; observe loading behavior.
 2. Uncomment `allProjectsQuery` in `project-list.tsx`.
 3. Replace the `suspenseFetch` with `usePrefetchQuery`, passing an instance of `allProjectsQuery()` as a parameter (Note: `usePrefetchQuery` has a return type of `void`).
    Example:
      usePrefetchQuery(allProjectsQuery());
 4. Replace the call to the getter function in the ProjectList component with a call to `useSuspenseQuery`, passing an instance of `allProjectsQuery()` as a parameter.
    Example:
      const { data } = useSuspenseQuery(allProjectsQuery());
 5. Remove the getter function from the ProjectList component props.
 6. Repeat steps 2-5 in `project.tsx`.
 7. Navigate between projects; observe loading behavior.

# Part II - Prefetching in route loaders
 8. Export a `loader` function from `project-list.tsx` (see https://reactrouter.com/en/main/route/loader).
 9. Turn the `loader` function into a higher-order function that first accepts a `queryClient: QueryClient` parameter.
    Example:
      export const loader = (queryClient: QueryClient) => async ({}: LoaderFunctionArgs) => {
10. Preload the `allProjectsQuery` function by passing an instance to `queryClient.ensureQueryData`.
    Example:
      const projectDetails = queryClient.ensureQueryData(allProjectsQuery());
11. Return an object that contains `projectDetails` from the loader function.
12. Remove `usePrefetchQuery` in the ProjectListPage component.
13. Repeat steps 8-12 in `project.tsx`.
14. Import loader functions from `project-list.tsx` and `project.tsx` into `index.tsx`. Set the `loader` property on each route definition to their respective loader function; be sure to pass the `queryClient` as an arguement to each loader function.
15. Navigate between projects; observe loading behavior. Try awaiting and of the `queryClient.ensureQueryData` calls; observe how this affects the loading behavior.

# Part III - Code splitting and lazy loading
16. Open the browser's devtools Network tab. In the browser's URL bar, navigate to the "/projects" route; observe the Waterfall section of the Network tab.
17. Uncomment the `LazyRouteParams` type and the `withQueryClient` function in `index.tsx`. Replace the `element` and `loader` properties for the "/projects/:projectId" route with the `lazy` property; assign it as shown in the example below.
    Example:
      lazy: async () => withQueryClient(await import("./project")),
18. Update the name of the exported component in `project.tsx` to be "Component" in order to match the type signature of the `withQueryClient` function.
19. Repeat step 16; observe how this has affected what data is sent and when.

# Part IV - Eager loading
20. Observe the Waterfall when navigating from "/projects" to "/projects/:projectId".
21. In `project.tsx`, export both `projectDetailsQuery` and `projectCommentsQuery`.
22. In `project-list.tsx`, add an `onMouseOver` prop to the NavLink in the ProjectList component; pass an empty async callback to the prop.
    Example:
      onMouseOver={async () => {}}
23. In the event handler's function body, import `projectDetailsQuery` and `projectCommentsQuery` from "./project";
24. In the component body, get the app's instance of `QueryClient` from the `useQueryClient` hook.
25. Back in the event handler, await a call to `queryClient.ensureQueryData` for both imported query functions.
26. Repeat step 20; observe how this has affected what data is sent and when.
