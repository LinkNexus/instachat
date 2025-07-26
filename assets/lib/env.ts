import {z} from 'zod';

const EnvSchema = z.object({
  VITE_SITE_NAME: z.string().url()
});

export const env = EnvSchema.parse(import.meta.env);
