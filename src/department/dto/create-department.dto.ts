import z from 'zod';

export const createDepartmentSchema = z.object({
  name: z.string().nonempty(),
});
export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;
