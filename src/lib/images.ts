import type { ImageCategory } from "../data/image-categories";
import { IMAGE_CATEGORIES } from "../data/image-categories";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type ImageCategoryLookupResult = {
  category?: ImageCategory;
  images: GalleryImage[];
};

const buildAltText = (categoryTitle: string, index: number, total: number) => {
  if (total <= 1) {
    return categoryTitle;
  }
  return `${categoryTitle} — ${index + 1}`;
};

export const getImagesForCategory = (
  key: string | null | undefined,
): ImageCategoryLookupResult => {
  if (!key) {
    return { images: [] };
  }

  const category = IMAGE_CATEGORIES.find((item) => item.id === key);
  if (!category) {
    return { images: [] };
  }

  const total = category.images.length;
  const images: GalleryImage[] = category.images.map((src, index) => ({
    src,
    alt: buildAltText(category.title, index, total),
  }));

  return { category, images };
};
