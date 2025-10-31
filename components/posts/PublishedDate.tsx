import CalendarIcon from "@/components/icons/CalendarIcon";

interface PublishedDateProps {
  date: string;
  className?: string;
}

export default function PublishedDate({ date, className = "text-sm text-netural-60" }: PublishedDateProps) {
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="flex items-center gap-2">
      <CalendarIcon className="w-4 h-4 text-netural-60" />
      <time className={className}>{formattedDate}</time>
    </div>
  );
}
