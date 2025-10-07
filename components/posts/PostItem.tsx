"use client";

import { Post } from "@/types/post";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface PostItemProps {
  post: Post;
}

export default function PostItem({ post }: PostItemProps) {
  const { title, summary, date, category, tags, thumbnail, slug, author } = post;
  const [imageError, setImageError] = useState(false);

  // 날짜 포맷팅
  const formattedDate = new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Link href={`/posts/${slug}`} className="block group h-full">
      <Card className="overflow-hidden bg-gray-700 border-gray-800 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col p-0">
        {/* Thumbnail */}
        {thumbnail && !imageError ? (
          <div className="relative w-full h-48 overflow-hidden bg-gray-800 flex-shrink-0">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          </div>
        ) : thumbnail && imageError ? (
          <div className="relative w-full h-48 overflow-hidden bg-gray-800 flex items-center justify-center flex-shrink-0">
            <span className="text-gray-400 text-sm">이미지를 불러올 수 없습니다</span>
          </div>
        ) : null}

        <div className="flex flex-col flex-grow p-6 gap-4">
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2 text-xs text-gray-400">
              {category && (
                <span className="px-2 py-1 bg-primary-900 text-gray-50 rounded-md font-medium">{category}</span>
              )}
            </div>

            {/* Title */}
            <CardTitle className="text-xl text-gray-50  transition-colors line-clamp-1">{title}</CardTitle>

            {/* Summary */}
            {summary && <CardDescription className="line-clamp-3 text-gray-200">{summary}</CardDescription>}
          </div>

          <div className="mt-auto">
            {/* Tags */}
            {tags && tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-600 text-gray-200 rounded text-xs font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            {author && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {author.profileImageUrl && (
                    <Image
                      src={author.profileImageUrl}
                      alt={author.name}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  )}
                  <span className="text-sm text-gray-100">{author.name}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-200">{formattedDate}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
}
