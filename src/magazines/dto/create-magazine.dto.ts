import { z } from 'zod';

export const createMagazineSchema = z.object({
  title: z.string(),
  content: z.string(),
  main_image_uri: z.string(),
  images: z.array(z.string()).default([]),
  status: z.enum(['PENDING', 'PUBLISHED']).default('PENDING'),
  published_at: z.coerce.date().optional(),
});

export type CreateMagazineDto = z.infer<typeof createMagazineSchema>;
