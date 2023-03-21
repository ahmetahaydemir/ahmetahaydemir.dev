import { z, defineCollection } from 'astro:content';

const devlog = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
    }),
});

const introduction = defineCollection({
    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.date()
    }),
});

export const collections = { devlog, introduction };