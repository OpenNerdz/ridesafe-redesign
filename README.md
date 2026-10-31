# Ridesafe redesign

A static rebuild of ridesafe.net (Ridesafe Motorcycle School Bradford). It has no framework: Node pre-renders every page from `src/content.mjs`, so pages work without JS and search engines can read them.

## Commands

    bash build.sh                     # images (PIL), map tile, then node build.mjs -> dist/
    node tools/serve.mjs dist 8702    # preview at http://127.0.0.1:8702
    node tools/check.mjs              # end-to-end checks (needs the preview server)

`build.sh` must be run through `bash`, because Termux has no `/usr/bin/env`.

## Where things live

- `src/content.mjs` holds the site facts and copy: phone, prices, hours, courses, FAQs, reviews.
- `src/layout.mjs` is the shared header, menu, search dialog, action bar and footer.
- `src/pages.mjs` is every page template.
- `src/site.css` is the design system: light and dark themes, breakpoints at 560/760/960/1100/1240.
- `src/site.js` handles the search engine, licence finder, live opening hours, menus and theme.
- `build.mjs` copies assets, builds `js/search-index.json`, JSON-LD and the sitemap, and writes `dist/`.
- `tools/` has the image resizing, the map tile fetch, the preview server, screenshots and checks.

`dist/` is plain static files. Any static host will serve it. Netlify also picks up `_redirects`.

## GitHub Pages

Pushing `main` runs `.github/workflows/pages.yml`, which publishes a noindex preview at `https://<owner>.github.io/<repo>/`. To host under a sub-path like that, build with these variables:

- `BASE=/<repo>` prefixes every root-relative URL in the output.
- `SITE_URL` sets the absolute URLs (canonical, og:image).
- `NOINDEX=1` adds noindex to every page and swaps robots.txt to Disallow.

You can test a sub-path build locally:

    BASE=/ridesafe-redesign NOINDEX=1 node build.mjs
    mkdir -p .cache/pages-root && ln -sfn ../../dist .cache/pages-root/ridesafe-redesign
    node tools/serve.mjs .cache/pages-root 8703
    node tools/check.mjs http://127.0.0.1:8703/ridesafe-redesign
