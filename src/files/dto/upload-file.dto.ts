import z from 'zod';

export const uploadFileSchema = z.object({
  name: z.string().min(1),
  file_uri: z.string().min(1),
});

export type UploadFileDto = z.infer<typeof uploadFileSchema>;
