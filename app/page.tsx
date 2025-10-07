import { getPublicPosts } from "@/lib/notion";

// ISR 60초마다 업데이트
export const revalidate = 60;

export default async function Home() {
  // TODO 추후 카드형태로 리스트 구현 예정
  const { posts, hasMore, nextCursor } = await getPublicPosts();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8 text-white">최신 게시글</h1>
      {/* TODO: 게시글 카드 리스트 구현 예정 */}
      <div className="space-y-4">
        {posts.map((post) => (
          <div
            key={post.id}
            className="p-4 border border-primary-900/50 bg-primary-900/5 rounded-lg hover:border-primary-700/50 transition-colors"
          >
            <h2 className="text-xl font-semibold text-white">{post.title}</h2>
            <p className="text-primary-300/80">{post.summary}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
