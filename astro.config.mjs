import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://www.areuroforet.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()]
});
