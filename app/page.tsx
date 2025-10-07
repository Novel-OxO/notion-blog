import { Button } from "@/components/ui/button";
import { getPublicPosts } from "@/lib/notion";

// ISR 60초마다 업데이트
export const revalidate = 60;

export default async function Home() {
  const { posts, hasMore, nextCursor } = await getPublicPosts();
  console.log(posts);

  return (
    <div>
      <div className="bg-primary-900 text-white">진한 보라색 배경</div>
      <div className="bg-sub-green">초록색 배경</div>
      <div className="hologram w-64 h-64 rounded-full"></div>
      <div className="point-gradient w-64 h-64 rounded-full"></div>
    </div>
  );
}
