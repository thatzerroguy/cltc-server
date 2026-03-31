import z from 'zod';

export const forwardFileSchema = z.object({
  target_department_id: z.string().uuid(),
  target_user_id: z.string().uuid().optional(),
  comment: z.string().optional(),
});

export type ForwardFileDto = z.infer<typeof forwardFileSchema>;
