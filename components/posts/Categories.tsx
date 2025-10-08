interface CategoriesProps {
  categories: Set<string>;
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export default function Categories({ categories, activeCategory, onCategoryChange }: CategoriesProps) {
  return (
    <div className="flex flex-wrap items-center gap-3 pb-4 mb-8 border-gray-400">
      {Array.from(categories).map((category) => (
        <button
          key={category}
          className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
            activeCategory === category ? "hologram text-gray-900" : "bg-primary-900 text-gray-50"
          }`}
          onClick={() => onCategoryChange(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
