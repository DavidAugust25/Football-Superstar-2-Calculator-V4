
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Version_4.1"
  },
  {
    "renderMode": 2,
    "redirectTo": "/Version_4.1",
    "route": "/**"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 20022, hash: '1de764d9e52225c1be5e4d5b548791a773d5dcda1d106351ff69d793b4448373', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 15718, hash: '317b24094e58989a55cf35cf99d6dd465a4b7acd6ac8cc41e2ead4b523230800', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'Version_4.1/index.html': {size: 46317, hash: 'd3ba047f663927328319469f04d6ee66a8a9bb1883e05604f0c7110ccdb98c5f', text: () => import('./assets-chunks/Version_4_1_index_html.mjs').then(m => m.default)},
    'styles-AIGT3T7Y.css': {size: 234969, hash: '16XbEJtHppw', text: () => import('./assets-chunks/styles-AIGT3T7Y_css.mjs').then(m => m.default)}
  },
};
