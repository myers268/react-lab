type ErrorPageProps = {
  error: Error;
};

export function ErrorPage(props: ErrorPageProps) {
  return (
    <div className="text-red-700 bg-red-200 p-1 border border-solid border-red-500">
      {props.error.message}
    </div>
  );
}
