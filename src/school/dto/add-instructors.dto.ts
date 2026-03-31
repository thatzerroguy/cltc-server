import z from 'zod';

export const addInstructorsSchema = z.object({
  instructor_ids: z.array(z.string().uuid()).min(1),
});

export type AddInstructorsDto = z.infer<typeof addInstructorsSchema>;

