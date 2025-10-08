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
          <h1 className="text-3xl font-bold text-gray-50 mb-4">포스트를 찾을 수 없습니다</h1>
          <p className="text-gray-300 mb-8">요청하신 포스트가 존재하지 않거나 삭제되었습니다.</p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-primary-900 text-gray-50 rounded-lg hover:bg-primary-700 transition-colors font-medium"
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
        {/* 헤더 섹션 */}
        <header className="mb-8 sm:mb-12">
          {/* 카테고리 */}
          {post.category && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 bg-primary-900 text-gray-50 rounded-md font-medium text-sm">
                {post.category}
              </span>
            </div>
          )}

          {/* 제목 */}
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-900 mb-4 sm:mb-6 ">{post.title}</h1>

          {/* 요약 */}
          {post.summary && <p className="text-lg sm:text-xl text-gray-50 mb-6 leading-relaxed">{post.summary}</p>}

          {/* 메타 정보 */}
          <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-gray-700">
            {post.author && (
              <Author
                author={post.author}
                imageSize={32}
                textClassName="text-sm sm:text-base text-gray-100 font-medium"
              />
            )}
            <PublishedDate date={post.date} className="text-sm sm:text-base text-gray-200" />
          </div>

          {/* 태그 */}
          {post.tags && post.tags.length > 0 && (
            <Tag
              tags={post.tags}
              className="px-3 py-1 bg-primary-700 text-gray-700 rounded-full text-sm font-medium"
              containerClassName="flex flex-wrap gap-2 mt-6"
            />
          )}
        </header>

        {/* 썸네일 */}
        {post.thumbnail && (
          <div className="relative w-full h-64 sm:h-96 mb-8 sm:mb-12 rounded-lg overflow-hidden bg-gray-800">
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
        <div className="prose prose-lg prose-neutral dark:prose-invert prose-headings:scroll-mt-24 max-w-none prose-headings:text-primary-900 prose-p:text-gray-100 prose-p:my-0 prose-li:text-gray-100 prose-strong:text-primary-900 prose-a:text-blue-400 hover:prose-a:text-blue-300 prose-code:text-sub-green prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-700 prose-blockquote:border-l-primary-900 prose-blockquote:text-gray-300 prose-img:rounded-lg">
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

        {/* 하단 구분선 및 네비게이션 영역 */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-500">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-colors font-medium"
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
            목록으로 돌아가기
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
