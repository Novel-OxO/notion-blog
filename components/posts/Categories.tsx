import { pipe, map, toArray } from "@fxts/core";

interface CategoriesProps {
  categories: Set<string>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Categories({ categories, activeCategory, onCategoryChange }: CategoriesProps) {
  const categoryButtons = pipe(
    categories,
    map((category) => (
      <button
        key={category}
        className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
          activeCategory === category ? "bg-neutral-95 text-mint-40" : "bg-secondary text-secondary-foreground"
        }`}
        onClick={() => onCategoryChange(category)}
      >
        {category}
      </button>
    )),
    toArray,
  );

  return <div className="flex flex-wrap items-center gap-3 pb-4 mb-8 border-gray-400">{categoryButtons}</div>;
}
