import { getPublicPosts } from "@/lib/notion";
import PostList from "@/components/posts/PostList";

export const revalidate = 60;

export default async function Home() {
  const { posts } = await getPublicPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 min-h-screen bg-gray-900">
      <PostList posts={posts} />
    </div>
  );
}
