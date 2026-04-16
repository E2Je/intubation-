/** Builds a URL to a public/assets file that works both in dev and on GitHub Pages */
export const assetUrl = (filename: string) =>
  `${import.meta.env.BASE_URL}assets/${encodeURIComponent(filename)}`;
