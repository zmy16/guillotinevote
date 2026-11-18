import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const SITE_URL_TOKEN = '__SITE_URL__';
const ABSOLUTE_URL_LINES = /^.*(rel="canonical"|property="og:url"|"url":|"image":).*\r?\n/gm;

function siteMetadata(siteUrl) {
  return {
    name: 'site-metadata',
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        const withoutAbsoluteOnlyTags = siteUrl ? html : html.replace(ABSOLUTE_URL_LINES, '');
        return withoutAbsoluteOnlyTags.replaceAll(SITE_URL_TOKEN, siteUrl);
      }
    },
    generateBundle() {
      const robotsLines = ['User-agent: *', 'Allow: /', 'Disallow: /*?r='];
      if (siteUrl) {
        robotsLines.push('', `Sitemap: ${siteUrl}/sitemap.xml`);
        const lastModified = new Date().toISOString().slice(0, 10);
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>${siteUrl}/</loc>\n    <lastmod>${lastModified}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>\n`
        });
      }
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robotsLines.join('\n')}\n` });
    }
  };
}

export default defineConfig(({ mode }) => {
  const siteUrl = (loadEnv(mode, process.cwd(), '').SITE_URL || '').replace(/\/+$/, '');
  return {
    plugins: [react(), siteMetadata(siteUrl)],
    test: {
      environment: 'node',
      include: ['tests/**/*.test.js', 'src/**/*.test.js']
    }
  };
});