import { Search } from "lucide-react";
import { Input } from "../ui/input";

export default function SearchBar() {
  return (
    <div className="relative">
      <Input
        type="text"
        placeholder="검색어를 입력하세요..."
        className="w-full bg-transparent border-gray-400 text-gray-50 rounded-lg placeholder:text-gray-400   focus-visible:border-primary-900 focus-visible:ring-primary-900"
      />
      <Search className="w-4 h-4 text-primary-900 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
    </div>
  );
}
