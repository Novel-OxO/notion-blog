import { getPublicPosts, getPublicPostsBySlug } from "@/lib/notion";
import { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import Image from "next/image";
import Link from "next/link";
import TableOfContents from "@/components/posts/TableOfContents";
import Author from "@/components/posts/Author";
import PublishedDate from "@/components/posts/PublishedDate";
import Tag from "@/components/posts/Tag";

export const revalidate = 60;

export async function generateStaticParams() {
  const { posts } = await getPublicPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { posts } = await getPublicPosts();
  const post = posts.find((post) => post.slug === slug);

  return {
    title: post?.title,
    description: post?.summary,
  };
}

export default async function PostDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { markdown, post } = await getPublicPostsBySlug(slug);

  if (markdown === null || post === null) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">포스트를 찾을 수 없습니다</h1>
          <p className="text-muted-foreground mb-8">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
          >
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <article className="max-w-3xl mx-auto">
        <header className="mb-8 sm:mb-12">
          {/* 제목 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-mint-40 mb-4 sm:mb-6">{post.title}</h1>

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-border">
            {post.author && (
              <Author author={post.author} imageSize={32} textClassName="text-sm sm:text-base font-medium" />
            )}
            <PublishedDate date={post.date} className="text-sm sm:text-base text-muted-foreground" />
          </div>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <Tag
              tags={post.tags}
              className="px-3 py-1 bg-yellow-bg-1 text-yellow-1 rounded-full text-sm font-medium"
              containerClassName="flex flex-wrap gap-2 mt-6"
            />
          )}
        </header>

        {/* 썸네일 */}
        {post.thumbnail && (
          <div className="relative w-full h-64 sm:h-96 mb-8 sm:mb-12 rounded-lg overflow-hidden bg-neutral-95">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              priority
            />
          </div>
        )}

        {/* 본문 */}
        <div className="prose prose-lg prose-neutral dark:prose-invert prose-headings:scroll-mt-24 max-w-none prose-headings:text-mint-40 prose-headings:my-4 prose-p:text-neutral-95 prose-p:my-0 prose-li:text-neutral-95 prose-li:marker:text-black prose-strong:font-bold prose-a:text-blue-1 hover:prose-a:text-mint-30 prose-code:text-mint-40 prose-pre:bg-neutral-95 prose-pre:border prose-pre:border-neutral-80 prose-blockquote:border-l-mint-40 prose-blockquote:text-neutral-95 prose-img:rounded-lg">
          <MDXRemote
            source={markdown}
            options={{
              mdxOptions: {
                remarkPlugins: [remarkGfm],
                rehypePlugins: [rehypeSlug, rehypeSanitize, rehypePrettyCode],
              },
            }}
          />
        </div>

        <div className="mt-12 sm:mt-16 pt-8 border-t border-neutral-50">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-neutral-95 text-neutral-10 rounded-lg hover:bg-neutral-90 transition-colors font-medium"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            홈으로
          </Link>
        </div>
      </article>

      {/* TOC - 고정 사이드바 (데스크탑에서만) */}
      <aside className="fixed top-24 right-8 hidden xl:block w-64 z-30">
        <TableOfContents markdown={markdown} />
      </aside>
    </div>
  );
}
