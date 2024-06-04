1. Define a new type `Ingredient`.

```ts
type Ingredient = {
  name: string;
  amount: number;
  unit: string;
};
```

2. Create a `LineItem` component; the component should render inputs for an ingredient, amount, an optional unit, and a "plus" button, all within a form. The component props should include a setState function named `setIngredients`.

```jsx
type LineItemProps = {
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
};

function LineItem({ setIngredients }: LineItemProps) {
  return (
    <form className="flex gap-2">
      <label className="basis-1/2">
        Ingredient
        <input
          name="name"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
      <label className="basis-1/4">
        Amount
        <input
          name="amount"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          type="number"
          step={0.5}
          required
        />
      </label>
      <label className="basis-1/4">
        Unit
        <input
          name="unit"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
        />
      </label>
      <button
        type="submit"
        aria-label="Add"
        title="Add"
        className="bg-green-300 border border-green-700 aspect-square w-8 mt-auto rounded-full"
      >
        +
      </button>
    </form>
  );
}
```

3. Add an `onSubmit` handler to the form in the `LineItem` component to handle adding a new ingredient using `setIngredients`.

```ts
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);

  const newIngredient: Ingredient = {
    name: formData.get("name")?.toString() ?? "",
    amount: Number.parseInt(formData.get("amount")?.toString() ?? ""),
    unit: formData.get("unit")?.toString() ?? "",
  };
  setIngredients((ingredients) => [...ingredients, newIngredient]);
}
```

4. Add a `useState` for `ingredients` and `setIngredients`. Replace the ingredients textarea with an instance of the `LineItem` component.

```jsx
const [ingredients, setIngredients] = useState<Ingredient[]>([]);

return (
  <div className="flex flex-col gap-8 w-64">
    <form className="flex flex-col gap-2" onSubmit={handleSubmit} />
      <label>
        Name
        <input
          name="name"
          form="add-recipe"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
      <LineItem setIngredients={setIngredients} />
```

5. Form elements cannot be nested; to get around this, replace the form in the `RecipeBook` component with a div. Above this div, add a self-closing form element with an `id` prop set to `"add-recipe"`. To associate elements with the new form, add a `form="add-recipe"` prop to the input and button elements.

```jsx
return (
  <div className="flex flex-col gap-8 w-64">
    <form id="add-recipe" onSubmit={handleSubmit} />
    <div className="flex flex-col gap-2">
      <label>
        Name
        <input
          name="name"
          form="add-recipe"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
      <LineItem setIngredients={setIngredients} />
      <button
        type="submit"
        form="add-recipe"
        className="border border-blue-700 px-1 mt-4 rounded w-full bg-blue-300"
      >
        Add Recipe
      </button>
    </div>
```

6. Clear the form in the `LineItem` component on submission using the `e.currentTarget.reset()` function.

7. Make visual updates to the `LineItem` component to accommodate deleting entries. When the `removeable` prop is set to `true`, the form inputs should be set to `readonly` and the "plus" button should be replaced with a "minus" button. Additionally, `name`, `amount`, and `unit` should be passed as optional props to the component and set as the `defaultValue` on the respective input elements.

```jsx
type LineItemProps = {
  name?: string;
  amount?: number;
  unit?: string;
  removeable?: boolean;
  setIngredients: React.Dispatch<React.SetStateAction<Ingredient[]>>;
};

function LineItem({
  name,
  amount,
  unit,
  removeable,
  setIngredients,
}: LineItemProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const newIngredient: Ingredient = {
      name: formData.get("name")?.toString() ?? "",
      amount: Number.parseInt(formData.get("amount")?.toString() ?? ""),
      unit: formData.get("unit")?.toString() ?? "",
    };
    setIngredients((ingredients) => [...ingredients, newIngredient]);
  }

  return (
    <form className="flex gap-2" onSubmit={handleSubmit}>
      <label className="basis-1/2">
        Ingredient
        <input
          name="name"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          defaultValue={name}
          readOnly={removeable}
          required
        />
      </label>
      <label className="basis-1/4">
        Amount
        <input
          name="amount"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          type="number"
          step={0.5}
          readOnly={removeable}
          defaultValue={amount}
          required
        />
      </label>
      <label className="basis-1/4">
        Unit
        <input
          name="unit"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          readOnly={removeable}
          defaultValue={unit}
        />
      </label>
      {removeable ? (
        <button
          type="submit"
          aria-label="Remove"
          title="Remove"
          className="bg-red-300 border border-red-700 aspect-square w-8 mt-auto rounded-full"
        >
          -
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Add"
          title="Add"
          className="bg-green-300 border border-green-700 aspect-square w-8 mt-auto rounded-full"
        >
          +
        </button>
      )}
    </form>
  );
}
```

8. In order to differentiate between "add" and "remove" operations within the same form, update the submit buttons in the `LineItem` component to include `name` and `value` props.

```jsx
{removeable ? (
  <button
    type="submit"
    aria-label="Remove"
    title="Remove"
    name="intent"
    value="remove"
    className="bg-red-300 border border-red-700 aspect-square w-8 mt-auto rounded-full"
  >
    -
  </button>
) : (
  <button
    type="submit"
    aria-label="Add"
    title="Add"
    name="intent"
    value="add"
    className="bg-green-300 border border-green-700 aspect-square w-8 mt-auto rounded-full"
  >
    +
  </button>
)}
```

9. Update the `handleSubmit` function in the `LineItem` component to handle deletes. Pass `e.nativeEvent.submitter` as the 2nd arguement to the `FormData` constructor to include the value of the submit button in the `formData` variable. Execute the appropriate code block depending on the submission intent; the "add" intent should wrap the existing code, while the "remove" intent should read the `name` from `formData` and remove the ingredient with a matching `name` from state.

```ts
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const nativeEvent = e.nativeEvent as SubmitEvent;
  const formData = new FormData(e.currentTarget, nativeEvent.submitter);
  const intent = formData.get("intent")?.toString() ?? "";

  if (intent === "add") {
    const newIngredient: Ingredient = {
      name: formData.get("name")?.toString() ?? "",
      amount: Number.parseInt(formData.get("amount")?.toString() ?? ""),
      unit: formData.get("unit")?.toString() ?? "",
    };
    setIngredients((ingredients) => [...ingredients, newIngredient]);
    e.currentTarget.reset();
  }

  if (intent === "remove") {
    const name = formData.get("name")?.toString() ?? "";
    setIngredients((ingredients) =>
      ingredients.filter((ingredient) => ingredient.name !== name)
    );
  }
}
```

10. Show the running list of added ingredients in the `RecipeBook` component using the new `removeable` variant of the `LineItem` component.

```jsx
return (
  <div className="flex flex-col gap-8 w-64">
    <form id="add-recipe" onSubmit={handleSubmit} />
    <div className="flex flex-col gap-2">
      <label>
        Name
        <input
          name="name"
          form="add-recipe"
          className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          required
        />
      </label>
      {ingredients.map(({ name, amount, unit }) => (
        <LineItem
          key={name}
          setIngredients={setIngredients}
          name={name}
          amount={amount}
          unit={unit}
          removeable
        />
      ))}
      <LineItem setIngredients={setIngredients} />
```

11. Update the `handleSubmit` function in the `RecipeBook` component to use the updated ingredients schema; validate that there is at least 1 ingredient and clear the form after updating state.

```ts
function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  if (ingredients.length > 0) {
    const newRecipe: Recipe = {
      name: formData.get("name")?.toString() ?? "",
      ingredients,
    };
    setRecipes((recipes) => [...recipes, newRecipe]);
    e.currentTarget.reset();
    setIngredients([]);
  }
}
```

12. Update the `RecipeCard` component to match the updated ingredients schema.

```jsx
function RecipeCard({ name, ingredients }: RecipeCardProps) {
  return (
    <li className="border border-double border-gray-500 rounded divide-y divide-gray-500">
      <h1 className="text-2xl text-center p-2">{name}</h1>
      <ul className="p-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.name}>{ingredient.name} {ingredient.amount} {ingredient.unit}</li>
        ))}
      </ul>
    </li>
  );
}
```

13. Add functions to format each ingredient entry in an organized manner; for example, transform `Salt 2 tsp` into `Salt × 2 tsps`.

```jsx
<ul className="p-2">
  {ingredients.map((ingredient) => (
    <li key={ingredient.name}>{formatIngredients(ingredient)}</li>
  ))}
</ul>

function formatIngredients({ name, amount, unit }: Ingredient) {
  const isPlural = amount !== 1;
  const hasUnit = unit !== "";

  return `${name} × ${amount}` + (hasUnit ? ` ${pluralize(unit!, isPlural)}` : "");
}

function pluralize(value: string, isPlural: boolean) {
  return value + (isPlural ? "s" : "")
}
```

14. Reset focus on form submission in the `LineItem` component by using a ref.

```jsx
const ref = useRef<HTMLInputElement>(null);

function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
  e.preventDefault();
  const nativeEvent = e.nativeEvent as SubmitEvent;
  const formData = new FormData(e.currentTarget, nativeEvent.submitter);
  const intent = formData.get("intent")?.toString() ?? "";

  if (intent === "add") {
    const newIngredient: Ingredient = {
      name: formData.get("name")?.toString() ?? "",
      amount: Number.parseInt(formData.get("amount")?.toString() ?? ""),
      unit: formData.get("unit")?.toString() ?? "",
    };
    setIngredients((ingredients) => [...ingredients, newIngredient]);
    e.currentTarget.reset();
    ref.current?.focus();
  }

  if (intent === "remove") {
    const name = formData.get("name")?.toString() ?? "";
    setIngredients((ingredients) =>
      ingredients.filter((ingredient) => ingredient.name !== name)
    );
  }
}

return (
  <form className="flex gap-2" onSubmit={handleSubmit}>
    <label className="basis-1/2">
      Ingredient
      <input
        ref={ref}
        name="name"
        className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
        defaultValue={name}
        readOnly={removeable}
        required
      />
    </label>
```
