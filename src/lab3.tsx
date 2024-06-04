/**
 *  1. Define a new type `Ingredient`.
 *  2. Create a `LineItem` component; the component should render inputs for an ingredient, amount, an optional unit, and a "plus" button, all within a form. The component props should include a setState function named `setIngredients`.
 *  3. Add an `onSubmit` handler to the form in the `LineItem` component to handle adding a new ingredient using `setIngredients`.
 *  4. Add a `useState` for `ingredients` and `setIngredients`. Replace the ingredients textarea with an instance of the `LineItem` component.
 *  5. Form elements cannot be nested; to get around this, replace the form in the `RecipeBook` component with a div. Above this div, add a self-closing form element with an `id` prop set to `"add-recipe"`. To associate elements with the new form, add a `form="add-recipe"` prop to the input and button elements.
 *  6. Clear the form in the `LineItem` component on submission using the `e.currentTarget.reset()` function.
 *  7. Make visual updates to the `LineItem` component to accommodate deleting entries. When the `removeable` prop is set to `true`, the form inputs should be set to `readonly` and the "plus" button should be replaced with a "minus" button. Additionally, `name`, `amount`, and `unit` should be passed as optional props to the component and set as the `defaultValue` on the respective input elements.
 *  8. In order to differentiate between "add" and "remove" operations within the same form, update the submit buttons in the `LineItem` component to include `name` and `value` props.
 *  9. Update the `handleSubmit` function in the `LineItem` component to handle deletes. Pass `e.nativeEvent.submitter` as the 2nd arguement to the `FormData` constructor to include the value of the submit button in the `formData` variable. Execute the appropriate code block depending on the submission intent; the "add" intent should wrap the existing code, while the "remove" intent should read the `name` from `formData` and remove the ingredient with a matching `name` from state.
 * 10. Show the running list of added ingredients in the `RecipeBook` component using the new `removeable` variant of the `LineItem` component.
 * 11. Update the `handleSubmit` function in the `RecipeBook` component to use the updated ingredients schema; validate that there is at least 1 ingredient and clear the form after updating state.
 * 12. Update the `RecipeCard` component to match the updated ingredients schema.
 * 13. Add functions to format each ingredient entry in an organized manner; for example, transform `Salt 2 tsp` into `Salt × 2 tsps`.
 * 14. Reset focus on form submission in the `LineItem` component by using a ref.
 */

import { ReactNode, useState } from "react";

type Recipe = {
  name: string;
  ingredients: string;
};

export function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

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
}

type RecipeBookProps = {
  children?: ReactNode;
  setRecipes: React.Dispatch<React.SetStateAction<Recipe[]>>;
};

function RecipeBook({ children, setRecipes }: RecipeBookProps) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newRecipe: Recipe = {
      name: formData.get("name")?.toString() ?? "",
      ingredients: formData.get("ingredients")?.toString() ?? "",
    };
    setRecipes((recipes) => [...recipes, newRecipe]);
  }
  
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
        <button
          type="submit"
          className="border border-blue-700 px-1 mt-4 rounded w-full bg-blue-300"
        >
          Add
        </button>
      </form>
      <hr className="border-gray-500" />
      <ul className="flex flex-col gap-4">{children}</ul>
    </div>
  );
}

type RecipeCardProps = {
  name: string;
  ingredients: string;
};

function RecipeCard({ name, ingredients }: RecipeCardProps) {
  return (
    <li className="border border-double border-gray-500 rounded divide-y divide-gray-500">
      <h1 className="text-2xl text-center p-2">{name}</h1>
      <div className="p-2">{ingredients}</div>
    </li>
  );
}
