import z from 'zod';

export const createSchoolSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  coordinator_id: z.string().uuid(),
  instructor_ids: z.array(z.string().uuid()).optional().default([]),
});

export type CreateSchoolDto = z.infer<typeof createSchoolSchema>;

