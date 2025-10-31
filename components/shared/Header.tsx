import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-2 bg-neutral-95">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link href="/" className="flex items-center gap-4">
            <Image src="/logo.svg" alt="Logo" width={32} height={32} />
            <div className="text-2xl font-bold text-mint-40 italic tracking-wide">Novel Blog</div>
          </Link>
        </div>
      </div>
    </header>
  );
}
