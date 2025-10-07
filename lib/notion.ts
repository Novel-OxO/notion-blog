import "server-only"; // 클라이언트 임포트 차단

import { Author, Post, type PostStatus } from "@/types/post";
import { Client, UserObjectResponse, PageObjectResponse } from "@notionhq/client";
import { NotionToMarkdown } from "notion-to-md";

// 여기 있는 코드는 서버에서만 동작해야 하기 때문에 클라이언트에서 직접 호출 하면 안됨
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const n2m = new NotionToMarkdown({ notionClient: notion });

function titleGuard(page: PageObjectResponse): string {
  return page.properties.title.type === "title" ? (page.properties.title.title[0]?.plain_text ?? "") : "";
}

function slugGuard(page: PageObjectResponse): string {
  return page.properties.slug.type === "rich_text" ? (page.properties.slug.rich_text[0]?.plain_text ?? "") : "";
}

function tagsGuard(page: PageObjectResponse): string[] {
  return page.properties.tags.type === "multi_select"
    ? page.properties.tags.multi_select.map((t: { name: string }) => t.name)
    : [];
}

function categoryGuard(page: PageObjectResponse): string {
  return page.properties.category.type === "select" ? (page.properties.category.select?.name ?? "") : "";
}

function summaryGuard(page: PageObjectResponse): string {
  return page.properties.summary.type === "rich_text" ? (page.properties.summary.rich_text[0]?.plain_text ?? "") : "";
}

function authorGuard(page: PageObjectResponse): Author | undefined {
  if (page.properties.author.type !== "people") {
    return undefined;
  }

  const author = page.properties.author.people[0] as UserObjectResponse;

  return {
    id: author.id ?? "",
    name: author.name ?? "",
    profileImageUrl: author.avatar_url ?? "",
  };
}

function dateGuard(page: PageObjectResponse): string {
  return page.properties.date.type === "date" ? (page.properties.date.date?.start ?? "") : "";
}

function statusGuard(page: PageObjectResponse): string {
  return page.properties.status.type === "select" ? (page.properties.status.select?.name ?? "") : "";
}

function thumbnailGuard(page: PageObjectResponse): string | undefined {
  if (page.properties.thumbnail.type !== "files") {
    return undefined;
  }

  if (page.properties.thumbnail.files.length === 0) {
    return undefined;
  }

  // TODO 도저히 타입을 못 찾겠다.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const thumbnail = page.properties.thumbnail.files[0] as any;

  if (thumbnail.type === "file") {
    return thumbnail.file.url ?? undefined;
  }

  if (thumbnail.type === "external") {
    return thumbnail.external.url ?? undefined;
  }

  return undefined;
}

// Notion 데이터를 파싱하여 Post 타입으로 변환
export function parsePost(page: PageObjectResponse): Post {
  const title = titleGuard(page);
  const slug = slugGuard(page);
  const tags = tagsGuard(page);
  const category = categoryGuard(page);
  const summary = summaryGuard(page);
  const author = authorGuard(page);
  const date = dateGuard(page);
  const thumbnail = thumbnailGuard(page);
  const statusName = statusGuard(page);

  const toPostStatus = (value?: string | null): PostStatus => (value === "Public" ? "Public" : "Private");

  return {
    id: page.id,
    date,
    slug,
    tags,
    category,
    summary,
    author,
    title,
    status: toPostStatus(statusName),
    thumbnail,
  };
}

// 데이터베이스 목록 조회 (기존에 찾던 방식으로 데이터베이스 아이디를 찾을 수 없어서 API를 직접 호출 하여 찾음)
export async function getDatabaseList() {
  const response = await notion.search({
    filter: {
      property: "object",
      value: "data_source",
    },
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  });
  return response;
}

/**
 * status가 Public인 포스트 상세 조회
 * @param slug 포스트 슬러그
 * @returns status가 Public인 포스트 상세
 */
export async function getPublicPostsBySlug(slug: string) {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "slug",
      rich_text: {
        equals: slug,
      },
    },
  });

  if (!response.results[0]) {
    return {
      markdown: null,
      post: null,
    };
  }

  // 아이디에 해당 하는 글을 마크다운으로 변환
  // 코드 참고: https://www.npmjs.com/package/notion-to-md
  const mdBlocks = await n2m.pageToMarkdown(response.results[0].id);
  const { parent } = n2m.toMarkdownString(mdBlocks);

  const post = response.results.find((page): page is PageObjectResponse => "properties" in page);

  return {
    markdown: parent,
    post: post ? parsePost(post) : null,
  };
}

/**
 * status가 Public인 포스트 목록 조회
 * @returns 공개된 포스트 목록
 */
export async function getPublicPosts(nextCursor?: string) {
  if (!process.env.NOTION_DATABASE_ID) {
    throw new Error("NOTION_DATABASE_ID is not set");
  }

  const response = await notion.dataSources.query({
    data_source_id: process.env.NOTION_DATABASE_ID,
    filter: {
      property: "status",
      select: {
        equals: "Public",
      },
    },
    ...(nextCursor ? { start_cursor: nextCursor } : {}),
  });

  const posts = response.results
    .filter((page): page is PageObjectResponse => "properties" in page)
    .map((post) => parsePost(post));

  return {
    posts,
    hasMore: response.has_more,
    nextCursor: response.next_cursor,
  };
}
