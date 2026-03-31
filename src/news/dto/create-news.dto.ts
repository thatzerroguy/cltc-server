import z from 'zod';

export const createNewsSchema = z.object({
  title: z.string(),
  content: z.string(),
  excerpt: z.string(),
  author_id: z.string(),
  main_image_uri: z.string(),
  images: z.array(z.string()).default([]),
  status: z.enum(['PENDING', 'PUBLISHED']),
  // JSON requests send dates as strings; coerce to Date
  published_at: z.coerce.date().optional(),
});

export type CreateNewsDto = z.infer<typeof createNewsSchema>;
