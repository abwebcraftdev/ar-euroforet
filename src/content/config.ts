import { defineCollection, z } from "astro:content";

const ctaSchema = z.object({
  label: z.string().min(1, "Le libellé du CTA est requis"),
  url: z.string().min(1, "L'URL du CTA est requise"),
  style: z.enum(["primary", "secondary", "ghost"]).optional(),
});

const cardSchema = z.object({
  title: z.string().optional(),
  body: z.string().optional(),
  price: z.string().optional(),
  startingFrom: z.boolean().default(false),
  ctas: z.array(ctaSchema).max(2, "Maximum 2 CTA par carte").default([]),
});

const heroImageSchema = z.object({
  src: z.string().min(1, "L'image est requise"),
  alt: z.string().optional(),
});

const galleryOverrideSchema = z.object({
  src: z.string().min(1, "Le chemin de l'image est requis"),
  alt: z.string().optional(),
});

const serviceSchema = z
  .object({
    title: z.string(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug en kebab-case seulement").optional(),
    excerpt: z.string(),
    price: z.string().optional(),
    startingFrom: z.boolean().default(false),
    order: z.number().optional(),
    featured: z.boolean().default(false),
    published: z.boolean().default(true),
    ctas: z.array(ctaSchema).max(2, "Maximum 2 CTA").default([]),
    mainCard: cardSchema,
    extraCards: z.array(cardSchema).max(12).default([]),
    imageCategoryKey: z.string().optional(),
    heroImage: heroImageSchema.optional(),
    galleryOverride: z.array(galleryOverrideSchema).default([]),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    openGraphImage: z.string().optional(),
  })
  .refine((data) => data.ctas.length <= 2, {
    message: "Maximum 2 CTA par service",
    path: ["ctas"],
  })
  .refine((data) => data.mainCard.ctas.length <= 2, {
    message: "Maximum 2 CTA dans la carte principale",
    path: ["mainCard", "ctas"],
  });

export const services = defineCollection({
  type: "content",
  schema: serviceSchema,
});

export const pages = defineCollection({
  type: "content",
  schema: z.object({
    titleHero: z.string(),
    intro: z.string(),
    bullets: z.array(z.string()).default([]),
  }),
});

export const collections = { services, pages };
