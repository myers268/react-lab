import { ReactNode, useRef, useState } from "react";

type Recipe = {
  name: string;
  ingredients: Ingredient[];
};

type Ingredient = {
  name: string;
  amount: number;
  unit: string;
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
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    if (ingredients.length > 0) {
      const newRecipe: Recipe = {
        name: formData.get("name")?.toString() ?? "",
        ingredients,
      };
      setRecipes((recipes) => [...recipes, newRecipe]);
      event.currentTarget.reset();
      setIngredients([]);
    }
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
            key={name}
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

type RecipeCardProps = {
  name: string;
  ingredients: Ingredient[];
};

function RecipeCard({ name, ingredients }: RecipeCardProps) {
  return (
    <li className="border border-double border-gray-500 rounded divide-y divide-gray-500">
      <h1 className="text-2xl text-center p-2">{name}</h1>
      <ul className="p-2">
        {ingredients.map((ingredient) => (
          <li key={ingredient.name}>{formatIngredients(ingredient)}</li>
        ))}
      </ul>
    </li>
  );
}

function formatIngredients({ name, amount, unit }: Ingredient) {
  const isPlural = amount !== 1;
  const hasUnit = unit !== "";

  return `${name} × ${amount}` + (hasUnit ? ` ${pluralize(unit!, isPlural)}` : "");
}

function pluralize(value: string, isPlural: boolean) {
  return value + (isPlural ? "s" : "")
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
    </form>
  );
}
