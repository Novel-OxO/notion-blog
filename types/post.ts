export type PostStatus = "Private" | "Public";

export interface Author {
  id: string;
  name: string;
  profileImageUrl?: string;
}

export interface Post {
  id: string;
  date: string;
  slug: string;
  tags?: string[];
  category?: string;
  summary?: string;
  author?: Author;
  title: string;
  status: PostStatus;
  thumbnail?: string;
}
