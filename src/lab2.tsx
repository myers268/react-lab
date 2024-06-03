/**
 * 1. Use the useState hook to create an empty recipe array
 * 2. Iterate over the recipes state variable to render a list of RecipeEntry components
 * 3. Use an onSubmit handler to update recipes state
 * 4. Leverage built-in form validation
 */

import { ReactNode } from "react";

type Recipe = {
  name: string;
  ingredients: string;
};

export function App() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl">Recipes</h1>
      <RecipeBook></RecipeBook>
    </div>
  );
}

type RecipeBookProps = {
  children?: ReactNode;
};

function RecipeBook({ children }: RecipeBookProps) {
  return (
    <div className="flex flex-col gap-8 w-64">
      <form className="flex flex-col gap-2">
        <label>
          Name
          <input
            name="name"
            className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
          />
        </label>
        <label>
          Ingredients
          <textarea
            name="ingredients"
            className="block border border-gray-500 px-1 rounded w-full bg-gray-100"
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

type RecipeEntryProps = {
  name: string;
  ingredients: string;
};

function RecipeEntry({ name, ingredients }: RecipeEntryProps) {
  return (
    <li className="border border-double border-gray-500 rounded divide-y divide-gray-500">
      <h1 className="text-2xl text-center p-1">{name}</h1>
      <div className="p-1">{ingredients}</div>
    </li>
  );
}
