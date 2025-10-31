import Image from "next/image";
import { Author as AuthorType } from "@/types/post";

interface AuthorProps {
  author: AuthorType;
  imageSize?: number;
  textClassName?: string;
}

export default function Author({ author, imageSize = 24, textClassName = "text-sm text-netural-95" }: AuthorProps) {
  return (
    <div className="flex items-center gap-2">
      {author.profileImageUrl && (
        <Image
          src={author.profileImageUrl}
          alt={author.name}
          width={imageSize}
          height={imageSize}
          className="rounded-full"
        />
      )}
      <span className={textClassName}>{author.name}</span>
    </div>
  );
}
