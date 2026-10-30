# Skin City

Skin City website source files, assets, and PHP form handlers are in `skincity/`.

## Run locally

Install Node.js, then run from this repository's root:

```sh
node serve.cjs
```

Open http://localhost:3000.

The included Node.js server serves the website for local previews. PHP form handlers require a PHP-capable web server and working mail configuration.

Local backup archives and verification artifacts are excluded from version control.

The October blog entries are maintained in `october-blogs.json`. Run
`node generate-october-blogs.cjs` after editing them to refresh their detail
pages, date-sorted Blog listing, homepage's three latest cards, and sitemap.
The production build runs this generator automatically. The publication dates are October 17 and October 30, 2026. The articles use `blog-89.png` and `blog-90.png`, with their matching `preblog` thumbnails.

Treatment review notes, sources and clinic confirmation items are documented in [TREATMENT-REVIEW.md](TREATMENT-REVIEW.md). Open `/treatments` for the treatment directory.

## Deploy on Vercel

Import this repository with Root Directory set to the repository root and Framework Preset set to Other. The included `vercel.json` runs `node build.cjs` and publishes `dist/`.

The build copies the website assets and converts extensionless HTML source pages to `.html` files. Vercel's clean URLs keep links such as `/about` working. Apache configuration and PHP source files are excluded from the static deployment; PHP forms still require a separate PHP-capable host.
