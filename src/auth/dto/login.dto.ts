import { z } from 'zod';

export const loginSchema = z.object({
  username: z.string().nonempty(),
  password: z.string().nonempty().min(6),
});

export type LoginDto = z.infer<typeof loginSchema>;
