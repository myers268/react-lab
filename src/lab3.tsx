import { ReactNode, useState } from "react";

type Recipe = {
  name: string;
  ingredients: string;
};

type Ingredient = {
  // id: string;
  name: string;
  amount: number;
  unit: string;
};

export function App() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  return (
    <div className="flex flex-col gap-4 items-center">
      <h1 className="text-2xl">Recipes</h1>
      <RecipeBook setTodos={setRecipes}>
        {recipes.map(({ name, ingredients }) => (
          <RecipeEntry name={name} ingredients={ingredients} />
        ))}
      </RecipeBook>
    </div>
  );
}

type RecipeBookProps = {
  children?: ReactNode;
  setTodos: React.Dispatch<React.SetStateAction<Recipe[]>>;
};

function RecipeBook({ children, setTodos }: RecipeBookProps) {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const newRecipe: Recipe = {
      name: formData.get("name")?.toString() ?? "",
      ingredients: formData.get("ingredients")?.toString() ?? "",
    };
    setTodos((recipes) => [...recipes, newRecipe]);
  }

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
            setIngredients={setIngredients}
            name={name}
            amount={amount}
            unit={unit}
            removeable
          />
        ))}
        <LineItem setIngredients={setIngredients} />
        <button
          type="submit"
          form="add-recipe"
          className="border border-blue-700 px-1 mt-4 rounded w-full bg-blue-300"
        >
          Add Recipe
        </button>
      </div>
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
    console.log(e);
    for (const [key, value] of formData.entries()) {
      console.log({ key, value });
    }
    const action = formData.get("action")?.toString() ?? "";

    if (action === "add") {
      const newIngredient: Ingredient = {
        name: formData.get("name")?.toString() ?? "",
        amount: Number.parseInt(formData.get("amount")?.toString() ?? ""),
        unit: formData.get("unit")?.toString() ?? "",
      };
      setIngredients((ingredients) => [...ingredients, newIngredient]);
    }
    if (action === "remove") {
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
          required
        />
      </label>
      {removeable ? (
        <button
          type="submit"
          aria-label="Remove"
          title="Remove"
          name="action"
          value="remove"
          className="bg-red-300 border border-red-700 aspect-square h-6 mt-6 rounded-full"
        >
          -
        </button>
      ) : (
        <button
          type="submit"
          aria-label="Add"
          title="Add"
          name="action"
          value="add"
          className="bg-green-300 border border-green-700 aspect-square h-6 mt-6 rounded-full"
        >
          +
        </button>
      )}
    </form>
  );
}
