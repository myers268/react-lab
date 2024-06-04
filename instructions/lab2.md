1. Use the `useState` hook to create an empty recipe array.

```jsx
export function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
```

2. Iterate over the `recipes` state variable to render a list of `RecipeCard` components.

```jsx
return (
  <div className="flex flex-col gap-4 items-center">
    <h1 className="text-2xl">Recipes</h1>
    <RecipeBook setRecipes={setRecipes}>
      {recipes.map(({ name, ingredients }) => (
        <RecipeCard key={name} name={name} ingredients={ingredients} />
      ))}
    </RecipeBook>
  </div>
);
```

3. Use an `onSubmit` handler to update recipes state. Parse the form fields from a `FormData` object and create a `newRecipe` variable; use the `setRecipes` state setter to merge `newRecipe` into the state array.

```ts
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const newRecipe: Recipe = {
    name: formData.get("name")?.toString() ?? "",
    ingredients: formData.get("ingredients")?.toString() ?? "",
  };
  setRecipes((recipes) => [...recipes, newRecipe]);
}
```

4. Leverage built-in form validation to ensure that a recipe name and ingredients are provided by adding the `required` prop to the input and textarea elements.

```jsx
return (
  <div className="flex flex-col gap-8 w-64">
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <label>
        Name
        <input
          name="name"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
      <label>
        Ingredients
        <textarea
          name="ingredients"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
    </form>
```
