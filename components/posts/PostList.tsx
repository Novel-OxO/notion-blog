"use client";

import { Post } from "@/types/post";
import { useState } from "react";
import PostItem from "./PostItem";
import Categories from "./Categories";

interface PostListProps {
  posts: Post[];
}

export default function PostList({ posts }: PostListProps) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = new Set([
    "All",
    ...posts.map((post) => post.category).filter((category) => category !== undefined),
  ]);

  const filteredPosts = activeCategory === "All" ? posts : posts.filter((post) => post.category === activeCategory);

  return (
    <div className="mb-8">
      <Categories categories={categories} activeCategory={activeCategory} onCategoryChange={setActiveCategory} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
        {filteredPosts.map((post) => (
          <PostItem key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
