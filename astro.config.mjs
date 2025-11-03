import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

const SITE_URL = 'https://www.areuroforet.fr';

export default defineConfig({
  site: SITE_URL,
  output: 'hybrid',
  adapter: vercel(),
  integrations: [tailwind({ applyBaseStyles: true }), sitemap()]
});
