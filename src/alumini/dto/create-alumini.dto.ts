import z from 'zod';

export const createAluminiSchema = z.object({
  name: z.string(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  address: z.string().optional(),
  school_id: z.string(),
  course_id: z.string(),
  year_of_participation: z.string().datetime().optional(),
  occupation: z.string().optional(),
  age: z.string().optional(),
  gender: z.string().optional(),
  sponsor: z.string().optional(),
  image_url: z.string().optional(),
});

export type CreateAluminiDto = z.infer<typeof createAluminiSchema>;
