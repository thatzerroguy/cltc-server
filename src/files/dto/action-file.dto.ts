import z from 'zod';

export const actionFileSchema = z.object({
  comment: z.string().optional(),
});

export type ActionFileDto = z.infer<typeof actionFileSchema>;
