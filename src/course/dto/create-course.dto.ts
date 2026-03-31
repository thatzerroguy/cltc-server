import z from 'zod';

export const createCourseSchema = z.object({
  school_id: z.string().uuid(),
  title: z.string().min(1),
  description: z.string().min(1),
  duration: z.string().min(1),
  location: z.string().min(1),
  year: z.string().min(1),
  instructor_id: z.string().uuid(),
  status: z
    .enum(['DRAFT', 'OPEN', 'CLOSED', 'IN_PROGRESS', 'COMPLETED'])
    .optional(),
  start_date: z.coerce.date(),
});

export type CreateCourseDto = z.infer<typeof createCourseSchema>;

