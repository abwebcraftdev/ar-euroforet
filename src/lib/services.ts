import type { CollectionEntry } from "astro:content";
import { getCollection, getEntryBySlug } from "astro:content";
import { SITE } from "../data/site";
import type { ImageCategory } from "../data/image-categories";
import { getImagesForCategory, type GalleryImage } from "./images";

export type CTAStyle = "primary" | "secondary" | "ghost";

export type CTA = {
  label: string;
  url: string;
  style?: CTAStyle;
};

export type ServiceCardContent = {
  title?: string;
  body?: string;
  price?: string;
  startingFrom?: boolean;
  ctas: CTA[];
};

export type ServiceData = {
  slug: string;
  title: string;
  excerpt: string;
  price?: string;
  startingFrom?: boolean;
  order?: number;
  featured?: boolean;
  published: boolean;
  heroImage?: GalleryImage;
  heroCtas: CTA[];
  mainCard: ServiceCardContent;
  extraCards: ServiceCardContent[];
  gallery: GalleryImage[];
  imageCategoryKey?: string;
  meta: {
    title?: string;
    description?: string;
    ogImage?: string;
  };
  jsonLd?: Record<string, unknown>;
};

const CTA_LIMIT = 2;

type RawGalleryOverrideItem =
  | string
  | {
      src?: string | null;
      alt?: string | null;
    };

type RawHeroImage =
  | string
  | {
      src?: string | null;
      alt?: string | null;
    };

type RawServiceCard = {
  title?: string | null;
  body?: string | null;
  price?: string | null;
  startingFrom?: boolean | null;
  ctas?: CTA[] | null;
};

type RawServiceEntry = CollectionEntry<"services"> & {
  data: {
    slug?: string;
    title: string;
    excerpt?: string | null;
    price?: string | null;
    startingFrom?: boolean | null;
    order?: number | null;
    featured?: boolean | null;
    published?: boolean | null;
    ctas?: CTA[] | null;
    mainCard?: RawServiceCard | null;
    extraCards?: RawServiceCard[] | null;
    imageCategoryKey?: string | null;
    heroImage?: RawHeroImage | null;
    galleryOverride?: RawGalleryOverrideItem[] | null;
    metaTitle?: string | null;
    metaDescription?: string | null;
    openGraphImage?: string | null;
  };
};

const sanitizeString = (value: string | null | undefined) => {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
};

const toHeroImage = (value: RawHeroImage | null | undefined, fallbackAlt: string): GalleryImage | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") {
    const src = sanitizeString(value);
    if (!src) return undefined;
    return { src, alt: fallbackAlt };
  }
  const src = sanitizeString(value.src ?? undefined);
  if (!src) return undefined;
  return { src, alt: sanitizeString(value.alt ?? undefined) ?? fallbackAlt };
};

const sanitizeCtas = (input: CTA[] | null | undefined): CTA[] => {
  if (!input) return [];
  return input
    .map((cta) => ({
      label: sanitizeString(cta?.label) ?? "",
      url: sanitizeString(cta?.url) ?? "",
      style: cta?.style ?? "primary",
    }))
    .filter((cta) => cta.label && cta.url)
    .slice(0, CTA_LIMIT);
};

const sanitizeCard = (card: RawServiceCard | null | undefined, fallbackCtas: CTA[]): ServiceCardContent => {
  const cardCtas = sanitizeCtas(card?.ctas ?? undefined);
  return {
    title: sanitizeString(card?.title ?? undefined),
    body: sanitizeString(card?.body ?? undefined),
    price: sanitizeString(card?.price ?? undefined),
    startingFrom: Boolean(card?.startingFrom),
    ctas: cardCtas.length ? cardCtas : fallbackCtas,
  };
};

const sanitizeExtraCards = (cards: RawServiceCard[] | null | undefined): ServiceCardContent[] => {
  if (!cards?.length) return [];
  return cards
    .map((card) => {
      const ctas = sanitizeCtas(card?.ctas ?? undefined);
      return {
        title: sanitizeString(card?.title ?? undefined),
        body: sanitizeString(card?.body ?? undefined),
        price: sanitizeString(card?.price ?? undefined),
        startingFrom: Boolean(card?.startingFrom),
        ctas,
      };
    })
    .filter((card) => card.title || card.body || card.price || card.ctas.length > 0)
    .map((card) => ({
      ...card,
      ctas: card.ctas.slice(0, CTA_LIMIT),
    }));
};

const sanitizeGalleryOverride = (
  overrides: RawGalleryOverrideItem[] | null | undefined,
  fallbackAlt: string,
): GalleryImage[] => {
  if (!overrides?.length) return [];
  return overrides
    .map((item) => {
      if (!item) return undefined;
      if (typeof item === "string") {
        const src = sanitizeString(item);
        if (!src) return undefined;
        return { src, alt: fallbackAlt };
      }
      const src = sanitizeString(item.src ?? undefined);
      if (!src) return undefined;
      return { src, alt: sanitizeString(item.alt ?? undefined) ?? fallbackAlt };
    })
    .filter((item): item is GalleryImage => Boolean(item?.src));
};

const mergeGalleries = (
  overrides: GalleryImage[],
  categoryImages: GalleryImage[],
  heroImage?: GalleryImage,
): GalleryImage[] => {
  if (overrides.length) {
    const seen = new Set(overrides.map((image) => image.src));
    const merged = [...overrides];
    categoryImages.forEach((image) => {
      if (!seen.has(image.src)) {
        seen.add(image.src);
        merged.push(image);
      }
    });
    return merged;
  }

  if (categoryImages.length) {
    return categoryImages;
  }

  return heroImage ? [heroImage] : [];
};

const toAbsoluteUrl = (input: string): string => {
  if (!input) return input;
  if (/^https?:\/\//i.test(input)) return input;
  return new URL(input, SITE.url).toString();
};

const extractPriceOffer = (price: string | undefined, currency = "EUR") => {
  if (!price) return undefined;
  const match = price.replace(",", ".").match(/(\d+(\.\d+)?)/);
  if (!match) return undefined;
  const numeric = Number.parseFloat(match[1]);
  if (Number.isNaN(numeric)) return undefined;
  return {
    "@type": "Offer",
    price: numeric.toFixed(2),
    priceCurrency: currency,
    availability: "https://schema.org/InStock",
  };
};

const buildJsonLd = (
  service: ServiceData,
  imageCategory?: ImageCategory,
): Record<string, unknown> | undefined => {
  const description = service.meta.description ?? service.excerpt;
  const images = service.gallery.map((image) => toAbsoluteUrl(image.src));
  const offer = extractPriceOffer(service.price ?? service.mainCard.price);

  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: SITE.name,
      telephone: SITE.phoneE164,
      url: SITE.url,
    },
    areaServed: SITE.areaServed,
    serviceType: imageCategory?.title ?? service.title,
  };

  if (images.length) {
    jsonLd.image = images;
  }

  if (offer) {
    jsonLd.offers = offer;
  }

  return jsonLd;
};

const mapServiceEntry = (entry: RawServiceEntry): ServiceData => {
  const { data } = entry;
  const fallbackSlug = entry.slug;
  const slug = sanitizeString(data.slug) ?? fallbackSlug;
  const title = data.title;
  const excerpt = sanitizeString(data.excerpt ?? undefined) ?? "";

  const heroImage = toHeroImage(data.heroImage ?? undefined, title);
  const heroCtas = sanitizeCtas(data.ctas ?? undefined);

  const mainCard = sanitizeCard(data.mainCard ?? undefined, heroCtas);
  const extraCards = sanitizeExtraCards(data.extraCards ?? undefined);

  const overrideImages = sanitizeGalleryOverride(data.galleryOverride ?? undefined, title);
  const { images: categoryImages, category } = getImagesForCategory(data.imageCategoryKey ?? undefined);
  const gallery = mergeGalleries(overrideImages, categoryImages, heroImage);

  const metaTitle = sanitizeString(data.metaTitle ?? undefined);
  const metaDescription = sanitizeString(data.metaDescription ?? undefined);
  const ogImage = sanitizeString(data.openGraphImage ?? undefined) ?? heroImage?.src ?? gallery[0]?.src;

  const service: ServiceData = {
    slug,
    title,
    excerpt,
    price: sanitizeString(data.price ?? undefined),
    startingFrom: Boolean(data.startingFrom),
    order: data.order ?? undefined,
    featured: Boolean(data.featured),
    published: data.published !== false,
    heroImage,
    heroCtas,
    mainCard,
    extraCards,
    gallery,
    imageCategoryKey: sanitizeString(data.imageCategoryKey ?? undefined),
    meta: {
      title: metaTitle,
      description: metaDescription ?? excerpt,
      ogImage,
    },
  };

  service.jsonLd = buildJsonLd(service, category);

  return service;
};

export const getAllServices = async (options?: { includeDrafts?: boolean }): Promise<ServiceData[]> => {
  const includeDrafts = options?.includeDrafts ?? false;
  const entries = (await getCollection("services")) as RawServiceEntry[];
  return entries
    .map(mapServiceEntry)
    .filter((service) => includeDrafts || service.published)
    .sort((a, b) => {
      const orderA = a.order ?? Number.POSITIVE_INFINITY;
      const orderB = b.order ?? Number.POSITIVE_INFINITY;
      if (orderA === orderB) {
        return a.title.localeCompare(b.title);
      }
      return orderA - orderB;
    });
};

export const getServiceBySlug = async (slug: string, options?: { includeDrafts?: boolean }): Promise<ServiceData | undefined> => {
  const entry = (await getEntryBySlug("services", slug)) as RawServiceEntry | undefined;
  if (!entry) {
    return undefined;
  }
  const service = mapServiceEntry(entry);
  if (!service.published && !options?.includeDrafts) {
    return undefined;
  }
  return service;
};

export const getServiceStaticPaths = async () => {
  const services = await getAllServices();
  return services.map((service) => ({
    params: { slug: service.slug },
    props: { service },
  }));
};
