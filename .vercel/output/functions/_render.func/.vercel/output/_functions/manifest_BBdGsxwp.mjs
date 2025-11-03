import 'cookie';
import 'kleur/colors';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/astro-designed-error-pages_BjvObsPw.mjs';
import 'es-module-lexer';
import { e as decodeKey } from './chunks/astro/server_CHsmqmy0.mjs';
import 'clsx';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/","adapterName":"@astrojs/vercel/serverless","routes":[{"file":"404.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/404","isIndex":false,"type":"page","pattern":"^\\/404\\/?$","segments":[[{"content":"404","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/404.astro","pathname":"/404","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"bois-de-chauffage/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/bois-de-chauffage","isIndex":false,"type":"page","pattern":"^\\/bois-de-chauffage\\/?$","segments":[[{"content":"bois-de-chauffage","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/bois-de-chauffage.astro","pathname":"/bois-de-chauffage","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"contact/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/contact","isIndex":false,"type":"page","pattern":"^\\/contact\\/?$","segments":[[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/contact.astro","pathname":"/contact","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"galerie/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/galerie","isIndex":false,"type":"page","pattern":"^\\/galerie\\/?$","segments":[[{"content":"galerie","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/galerie.astro","pathname":"/galerie","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"mentions-legales/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/mentions-legales","isIndex":false,"type":"page","pattern":"^\\/mentions-legales\\/?$","segments":[[{"content":"mentions-legales","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/mentions-legales.astro","pathname":"/mentions-legales","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"politique-de-confidentialite/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/politique-de-confidentialite","isIndex":false,"type":"page","pattern":"^\\/politique-de-confidentialite\\/?$","segments":[[{"content":"politique-de-confidentialite","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/politique-de-confidentialite.astro","pathname":"/politique-de-confidentialite","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"services/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/services","isIndex":true,"type":"page","pattern":"^\\/services\\/?$","segments":[[{"content":"services","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/services/index.astro","pathname":"/services","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"zone-d_intervention/index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/zone-d_intervention","isIndex":false,"type":"page","pattern":"^\\/zone-d_intervention\\/?$","segments":[[{"content":"zone-d_intervention","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/zone-d_intervention.astro","pathname":"/zone-d_intervention","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"index.html","links":[],"scripts":[],"styles":[],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":true,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/astro/dist/assets/endpoint/generic.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/contact","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/contact\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"contact","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/contact.ts","pathname":"/api/contact","prerender":false,"fallbackRoutes":[],"_meta":{"trailingSlash":"ignore"}}}],"site":"https://www.areuroforet.fr","base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/404.astro",{"propagation":"none","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/bois-de-chauffage.astro",{"propagation":"in-tree","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/contact.astro",{"propagation":"none","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/galerie.astro",{"propagation":"none","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/mentions-legales.astro",{"propagation":"none","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/politique-de-confidentialite.astro",{"propagation":"none","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/services/[slug].astro",{"propagation":"in-tree","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/services/index.astro",{"propagation":"in-tree","containsHead":true}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/pages/zone-d_intervention.astro",{"propagation":"none","containsHead":true}],["\u0000astro:content",{"propagation":"in-tree","containsHead":false}],["/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/lib/services.ts",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/bois-de-chauffage@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astrojs-ssr-virtual-entry",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/index@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/services/[slug]@_@astro",{"propagation":"in-tree","containsHead":false}],["\u0000@astro-page:src/pages/services/index@_@astro",{"propagation":"in-tree","containsHead":false}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(o,t)=>{let i=async()=>{await(await o())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var s=(i,t)=>{let a=async()=>{await(await i())()};if(t.value){let e=matchMedia(t.value);e.matches?a():e.addEventListener(\"change\",a,{once:!0})}};(self.Astro||(self.Astro={})).media=s;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var l=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let a of e)if(a.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=l;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000noop-middleware":"_noop-middleware.mjs","\u0000@astrojs-ssr-virtual-entry":"entry.mjs","\u0000@astro-renderers":"renderers.mjs","\u0000@astro-page:src/pages/404@_@astro":"pages/404.astro.mjs","\u0000@astro-page:src/pages/api/contact@_@ts":"pages/api/contact.astro.mjs","\u0000@astro-page:src/pages/bois-de-chauffage@_@astro":"pages/bois-de-chauffage.astro.mjs","\u0000@astro-page:src/pages/mentions-legales@_@astro":"pages/mentions-legales.astro.mjs","\u0000@astro-page:src/pages/politique-de-confidentialite@_@astro":"pages/politique-de-confidentialite.astro.mjs","\u0000@astro-page:src/pages/services/[slug]@_@astro":"pages/services/_slug_.astro.mjs","\u0000@astro-page:src/pages/services/index@_@astro":"pages/services.astro.mjs","\u0000@astro-page:src/pages/zone-d_intervention@_@astro":"pages/zone-d_intervention.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astro-page:src/pages/galerie@_@astro":"pages/galerie.astro.mjs","\u0000@astro-page:src/pages/contact@_@astro":"pages/contact.astro.mjs","\u0000@astro-page:node_modules/astro/dist/assets/endpoint/generic@_@js":"pages/_image.astro.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/node_modules/astro/dist/env/setup.js":"chunks/astro/env-setup_Cr6XTFvb.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/pages/home.md?astroContentCollectionEntry=true":"chunks/home_Du2VLFo8.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/bois-de-chauffage.md?astroContentCollectionEntry=true":"chunks/bois-de-chauffage_BuB45vjQ.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/debroussaillage.md?astroContentCollectionEntry=true":"chunks/debroussaillage_CfU5NVJw.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/elagage-abattage.md?astroContentCollectionEntry=true":"chunks/elagage-abattage_D7dL51_A.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/travaux-forestiers.md?astroContentCollectionEntry=true":"chunks/travaux-forestiers_Nbrq-hyY.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/vente-sur-pied.md?astroContentCollectionEntry=true":"chunks/vente-sur-pied_B_lwlXAa.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/pages/home.md?astroPropagatedAssets":"chunks/home_D3iO-C3y.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/bois-de-chauffage.md?astroPropagatedAssets":"chunks/bois-de-chauffage_CNjer_9B.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/debroussaillage.md?astroPropagatedAssets":"chunks/debroussaillage_D0855Cxd.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/elagage-abattage.md?astroPropagatedAssets":"chunks/elagage-abattage_ByDNywBR.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/travaux-forestiers.md?astroPropagatedAssets":"chunks/travaux-forestiers_DLeO-4ol.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/vente-sur-pied.md?astroPropagatedAssets":"chunks/vente-sur-pied_wBbEc_fo.mjs","\u0000astro:asset-imports":"chunks/_astro_asset-imports_D9aVaOQr.mjs","\u0000astro:data-layer-content":"chunks/_astro_data-layer-content_BcEe_9wP.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/pages/home.md":"chunks/home_BZks0cAh.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/bois-de-chauffage.md":"chunks/bois-de-chauffage_BM9Bzmr0.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/debroussaillage.md":"chunks/debroussaillage_TcFbUiGi.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/elagage-abattage.md":"chunks/elagage-abattage_BpX6gW7F.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/travaux-forestiers.md":"chunks/travaux-forestiers_D4tIGSLy.mjs","/Users/andrebertea/Projects/web_site/AR-FORET/ar-euro-foret-astro-starter-cms/src/content/services/vente-sur-pied.md":"chunks/vente-sur-pied_eSZLbT62.mjs","\u0000@astrojs-manifest":"manifest_BBdGsxwp.mjs","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/bois-de-chauffage.D2PoyCh6.css","/favicon.jpg","/logo-ar-foret.jpeg","/robots.txt","/admin/config.yml","/admin/config.yml.vercel.example","/admin/index.html","/fonts/Myndraine.otf","/uploads/logo-ar-foret.jpeg","/images/029D48B3-CEEE-49D1-86F2-82ED3435BBEC.PNG","/images/39D478D0-4D2C-4AD1-AC39-A6AA8DF96A75.PNG","/images/3B3352B3-6A06-4E08-A32A-38DF8B79A84C.PNG","/images/3f3dc5d1-ec99-43c1-9e11-85064516bf10.JPG","/images/8b17c07a-e8ef-43e0-bc83-4479f1598b06.JPG","/images/BC509015-B4AC-44B7-AC32-61352EF98AC2.PNG","/images/CE93CDE1-C60A-4B9A-9361-E105A5A9C90C.PNG","/images/IMG_9680.JPG","/images/IMG_9681.JPG","/images/IMG_9682.JPG","/images/IMG_9683.JPG","/images/IMG_9684.JPG","/images/IMG_9685.JPG","/images/IMG_9686.JPG","/images/IMG_9687.JPG","/images/IMG_9689.JPG","/images/IMG_9690.JPG","/images/IMG_9691.JPG","/images/IMG_9692.JPG","/images/IMG_9693.JPG","/images/IMG_9695.JPG","/images/IMG_9696.JPG","/images/IMG_9697.JPG","/images/IMG_9698.JPG","/images/IMG_9699.JPG","/images/IMG_9700.JPG","/images/IMG_9701.JPG","/images/IMG_9702.JPG","/images/IMG_9703.JPG","/images/IMG_9704.JPG","/images/IMG_9705.JPG","/images/IMG_9706.JPG","/images/IMG_9707.JPG","/images/IMG_9708.JPG","/images/IMG_9709.JPG","/images/IMG_9710.JPG","/images/IMG_9711.JPG","/images/IMG_9712.JPG","/images/IMG_9714.JPG","/images/IMG_9715.JPG","/images/IMG_9716.JPG","/images/IMG_9717.JPG","/images/IMG_9718.JPG","/images/IMG_9719.JPG","/images/IMG_9720.JPG","/images/IMG_9721.JPG","/images/VIDEO-2025-11-02-18-50-36.MP4","/images/hero.svg","/images/home-1280.JPG","/images/home-1920.JPG","/images/home-640.JPG","/images/home.JPG","/images/map-placeholder.svg","/images/wood-placeholder.svg","/404.html","/bois-de-chauffage/index.html","/contact/index.html","/galerie/index.html","/mentions-legales/index.html","/politique-de-confidentialite/index.html","/services/index.html","/zone-d_intervention/index.html","/index.html"],"buildFormat":"directory","checkOrigin":false,"serverIslandNameMap":[],"key":"eQMFN5gSXosgo0hkk0SkI5wF6KLl3E53nnbgdLKuNx8=","experimentalEnvGetSecretEnabled":false});

export { manifest };
