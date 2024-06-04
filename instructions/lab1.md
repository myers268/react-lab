1. Return valid JSX from the App component.

```jsx
export function App() {
  return (
    <>
      <Title>Lab 1</Title>
      <Greeting name="Zack" />
    </>
  );
}
```

2. Render the passed text "Lab 1" in the Title component by using the `children` prop.

```jsx
function Title({ children }) {
  return <h1 className="text-2xl">{children}</h1>;
}
```

3. Fix the props in the Greeting component.

```jsx
function Greeting({ name }) {
  return <div>Hey {name}, welcome to CoStar!</div>;
}
```

4. Add types for component props.

```jsx
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
```
