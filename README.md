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

## Deploy on Vercel

Import this repository with Root Directory set to the repository root and Framework Preset set to Other. The included `vercel.json` runs `node build.cjs` and publishes `dist/`.

The build copies the website assets and converts extensionless HTML source pages to `.html` files. Vercel's clean URLs keep links such as `/about` working. Apache configuration and PHP source files are excluded from the static deployment; PHP forms still require a separate PHP-capable host.
