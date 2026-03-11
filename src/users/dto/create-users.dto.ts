import z from 'zod';

export const createUserSchema = z.object({
  user_name: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  email: z.string().email({
    message: 'Invalid email address',
  }),
  password: z.string(),
  role: z.enum(['ADMIN', 'SUPER_ADMIN']),
  sub_role: z.enum([
    'HEAD',
    'SECRETARY',
    'STAFF',
    'COURSE_COORDINATOR',
    'COURSE_INSTRUCTOR',
  ]),
  department: z.string(),
  position: z.string(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;
