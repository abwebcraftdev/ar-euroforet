export type ImageCategory = {
  id: string;
  title: string;
  images: string[]; // chemin public, ex: "/images/IMG_9684.jpg"
};

// Pour ajouter une catégorie, insérez un objet avec un id unique et la liste de visuels
// correspondants. Les chemins doivent pointer vers des fichiers présents dans public/images.
export const IMAGE_CATEGORIES: readonly ImageCategory[] = [
  {
    id: "bois-de-chauffage",
    title: "Bois de chauffage",
    images: [
      "/images/IMG_9684.JPG",
      "/images/IMG_9699.JPG",
      "/images/IMG_9704.JPG",
      "/images/IMG_9707.JPG",
      "/images/IMG_9714.JPG",
      "/images/IMG_9691.JPG",
    ],
  },
  {
    id: "travaux-forestiers",
    title: "Travaux forestiers",
    images: [
      "/images/IMG_9690.JPG",
      "/images/IMG_9695.JPG",
      "/images/IMG_9701.JPG",
      "/images/IMG_9711.JPG",
      "/images/IMG_9715.JPG",
      "/images/IMG_9718.JPG",
      "/images/IMG_9719.JPG",
      "/images/IMG_9720.JPG",
    ],
  },
  {
    id: "elagage-abattage",
    title: "Élagage & Abattage",
    images: [
      "/images/IMG_9681.JPG",
      "/images/IMG_9682.JPG",
      "/images/IMG_9717.JPG",
      "/images/IMG_9716.JPG",
      "/images/IMG_9686.JPG",
      "/images/IMG_9696.JPG",
      "/images/IMG_9697.JPG",
      "/images/IMG_9700.JPG",
      "/images/IMG_9709.JPG",
      "/images/IMG_9710.JPG",
      "/images/IMG_9711.JPG",

    ],
  },
  {
    id: "debroussaillage",
    title: "Débroussaillage",
    images: [
      "/images/IMG_9680.JPG",
      "/images/IMG_9683.JPG",
      "/images/IMG_9685.JPG",
      "/images/IMG_9687.JPG",
      "/images/IMG_9692.JPG",
      "/images/IMG_9693.JPG",
      "/images/IMG_9698.JPG",
    ],
  },
  {
    id: "vente-sur-pied",
    title: "Vente sur pied",
    images: [
        "/images/IMG_9703.JPG",
        "/images/IMG_9708.JPG",
    ],
  },
] as const;

export type ImageCategories = typeof IMAGE_CATEGORIES;

