/**
 * 1. Return valid JSX from the App component
 * 2. Render the passed text "Lab 1" in the Title component
 * 3. Fix the props in the Greeting component
 * 4. Add types for component props
 */

export function App() {
  return (
    <>
      <Title>Lab 1</Title>
      <Greeting name="Zack" />
    </>
  );
}

type TitleProps = {
  children: React.ReactNode;
}

function Title({ children }: TitleProps) {
  return <h1 className="text-2xl">{children}</h1>;
}

type GreetingProps = {
  name: string;
}

function Greeting({ name }: GreetingProps) {
  return <div>Hey {name}, welcome to CoStar!</div>;
}
