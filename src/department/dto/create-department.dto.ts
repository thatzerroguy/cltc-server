import z from 'zod';

export const CreateDepartmentSchema = z.object({
  name: z.string().nonempty(),
});
export type CreateDepartmentDto = z.infer<typeof CreateDepartmentSchema>;
