import {z} from 'zod';

const EnvSchema = z.object({
  VITE_SERVER_URL: z.string().url(),
  VITE_BASE_URL: z.string().url()
});

export const env = EnvSchema.parse(import.meta.env);
