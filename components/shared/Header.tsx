import Link from "next/link";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 bg-gray-900 border-b border-gray-400">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold text-primary-900 italic tracking-wide">Novel Blog</div>
          </Link>
        </div>
      </div>
    </header>
  );
}
