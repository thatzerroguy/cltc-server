import z from 'zod';

export const createNewsSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  author_id: z.string(),
  main_image_uri: z.string(),
  images: z.array(z.string()),
  status: z.enum(['PENDING', 'PUBLISHED']),
  published_at: z.date().optional(),
});

export type CreateNewsDto = z.infer<typeof createNewsSchema>;
