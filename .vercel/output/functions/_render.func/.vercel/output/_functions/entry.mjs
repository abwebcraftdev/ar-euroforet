import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_SKODV7oV.mjs';
import { manifest } from './manifest_BBdGsxwp.mjs';

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/api/contact.astro.mjs');
const _page3 = () => import('./pages/bois-de-chauffage.astro.mjs');
const _page4 = () => import('./pages/contact.astro.mjs');
const _page5 = () => import('./pages/galerie.astro.mjs');
const _page6 = () => import('./pages/mentions-legales.astro.mjs');
const _page7 = () => import('./pages/politique-de-confidentialite.astro.mjs');
const _page8 = () => import('./pages/services/_slug_.astro.mjs');
const _page9 = () => import('./pages/services.astro.mjs');
const _page10 = () => import('./pages/zone-d_intervention.astro.mjs');
const _page11 = () => import('./pages/index.astro.mjs');

const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/api/contact.ts", _page2],
    ["src/pages/bois-de-chauffage.astro", _page3],
    ["src/pages/contact.astro", _page4],
    ["src/pages/galerie.astro", _page5],
    ["src/pages/mentions-legales.astro", _page6],
    ["src/pages/politique-de-confidentialite.astro", _page7],
    ["src/pages/services/[slug].astro", _page8],
    ["src/pages/services/index.astro", _page9],
    ["src/pages/zone-d_intervention.astro", _page10],
    ["src/pages/index.astro", _page11]
]);
const serverIslandMap = new Map();
const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "22cf2cb0-da2a-4bf4-ac6a-ef6b44ebbb19",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
