import { useEffect, useState } from "react";

export type ProjectDetails = {
  id: string;
  name: string;
  description: string;
};

const projectDetails = new Map<string, ProjectDetails>([
  [
    "1",
    {
      id: "1",
      name: "Intro to React",
      description: "Web development fundamentals with React",
    },
  ],
  [
    "2",
    {
      id: "2",
      name: "Advanced React",
      description: "Data loading and routing",
    },
  ],
]);

export const fetchAllProjects = () =>
  sleep().then(() => Array.from(projectDetails.values()));

export const fetchProject = async (projectId: string) =>
  sleep().then(() => mockFetch(projectDetails.get(projectId)!));

export type Comment = {
  id: string;
  message: string;
};

const commentsByProjectId = new Map<string, Comment[]>([
  ["1", [{ id: "1", message: "Cool!" }]],
  [
    "2",
    [
      { id: "3", message: "I ❤️ data loading" },
      { id: "4", message: "Nice 💯" },
    ],
  ],
]);

export const fetchComments = (projectId: string) =>
  sleep().then(() => mockFetch(commentsByProjectId.get(projectId)!));

const sleep = (minMs = 200, maxMs = 2000) =>
  new Promise((resolve) =>
    setTimeout(resolve, Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs)
  );

export function mockFetch<T>(data: T, failureRate = 0) {
  return new Promise<T>((resolve, reject) => {
    if (Math.random() > failureRate) {
      resolve(data);
    } else {
      reject(new Error("Request timed out"));
    }
  });
}

export function useParams() {
  return { id: "1" };
}

export function useFetch<T>(promise: Promise<T>) {
  const [result, setResult] = useState<T | Error>();

  useEffect(() => {
    (async () => {
      setResult(await promise.catch(err => err));
    })();
  }, []);

  if (typeof result === "undefined") {
    return { data: undefined, error: undefined, isLoading: true } as const;
  }

  if (result instanceof Error) {
    return { data: undefined, error: result, isLoading: false } as const;
  }

  return { data: result, error: undefined, isLoading: false } as const;
}

const resultMap = new Map<
  Promise<any>,
  { status: "pending" | "resolved" | "rejected"; result: any }
>();

export function suspenseFetch<T>(promise: Promise<T>) {
  if (!resultMap.has(promise)) {
    resultMap.set(promise, { status: "pending", result: null });
  }

  const pending = promise
    .then((result) => {
      resultMap.set(promise, { status: "resolved", result });
    })
    .catch((error) => {
      resultMap.set(promise, { status: "rejected", result: error });
    });

  return () => {
    const { status, result } = resultMap.get(promise)!;

    if (status === "pending") {
      throw pending;
    } else if (status === "rejected") {
      throw result as Error;
    } else {
      return result as T;
    }
  };
}
