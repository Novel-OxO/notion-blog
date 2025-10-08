"use client";

import { Post } from "@/types/post";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import PublishedDate from "./PublishedDate";
import Author from "./Author";
import Tag from "./Tag";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const { title, summary, date, tags, thumbnail, slug, author } = post;

  return (
    <Link href={`/post/${slug}`} className="block group h-full">
      <Card className="overflow-hidden bg-gray-700 border-gray-800 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-0">
        {thumbnail && (
          <div className="relative w-full h-48 overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}

        <div className="flex flex-col flex-grow p-6 gap-4">
          <div className="flex flex-col gap-3">
            <CardTitle className="text-xl text-gray-50  transition-colors line-clamp-1">{title}</CardTitle>
            {summary && <CardDescription className="line-clamp-3 text-gray-200">{summary}</CardDescription>}
          </div>

          <div className="mt-auto">
            <Tag tags={tags || []} />

            {author && (
              <div className="flex items-center justify-between gap-2">
                <Author author={author} />
                <PublishedDate date={date} />
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
