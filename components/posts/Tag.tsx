interface TagProps {
  tags: string[];
  className?: string;
  containerClassName?: string;
}

export default function Tag({
  tags,
  className = "px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs font-medium",
  containerClassName = "flex flex-wrap gap-2 mb-4",
}: TagProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <div className={containerClassName}>
      {tags.map((tag) => (
        <span key={tag} className={className}>
          {tag}
        </span>
      ))}
    </div>
  );
}
