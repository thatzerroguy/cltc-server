import z from 'zod';
import { createNewsSchema } from './create-news.dto';

export const updateNewsSchema = createNewsSchema.partial();

export type UpdateNewsDto = z.infer<typeof updateNewsSchema>;
