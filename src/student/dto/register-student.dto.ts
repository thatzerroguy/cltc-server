import z from 'zod';

export const registerStudentSchema = z.object({
  course_id: z.string().uuid(),
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  address: z.string().min(1),
});

export type RegisterStudentDto = z.infer<typeof registerStudentSchema>;

