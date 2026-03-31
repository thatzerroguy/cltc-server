import z from 'zod';

export const updateCourseStatusSchema = z.object({
  status: z.enum(['DRAFT', 'OPEN', 'CLOSED', 'IN_PROGRESS', 'COMPLETED']),
});

export type UpdateCourseStatusDto = z.infer<typeof updateCourseStatusSchema>;
