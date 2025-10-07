"use client";

import { Post } from "@/types/post";
import { useState } from "react";
import PostItem from "./PostItem";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = new Set([
    "All",
    ...posts.map((post) => post.category).filter((category) => category !== undefined),
  ]);

  // 카테고리 필터링
  const filteredPosts = activeCategory === "All" ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="mb-8">
      {/* Category Filter */}
      <div className="flex flex-wrap items-center gap-3 pb-4 mb-8  border-gray-400">
        <span className="text-gray-50 font-bold text-lg mr-4">Category</span>
        {Array.from(categories).map((category) => (
          <button
            key={category}
            className={`px-4 py-2 cursor-pointer rounded-lg text-sm font-medium transition-all ${
              activeCategory === category
                ? "hologram text-gray-900"
                : "bg-primary-900 text-gray-50 hover:bg-primary-700"
            }`}
            onClick={() => setActiveCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>

      {/* Empty State */}
      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">게시글이 없습니다.</p>
        </div>
      )}
    </div>
  );
}
