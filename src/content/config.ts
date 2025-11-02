import { defineCollection, z } from 'astro:content';

export const services = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string().optional(),
    order: z.number().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    ctaType: z.enum(['page', 'call']).optional(),
    ctaLabel: z.string().optional()
  })
});

export const pages = defineCollection({
  type: 'content',
  schema: z.object({
    titleHero: z.string(),
    intro: z.string(),
    bullets: z.array(z.string()).default([])
  })
});

export const collections = { services, pages };
