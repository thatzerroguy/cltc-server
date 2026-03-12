export interface News {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  main_image_uri: string;
  images: string[];
  status: string;
  published_at: Date | null;
}
