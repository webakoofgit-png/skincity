// Shared source for the new static detail pages and both existing card lists.
const fs = require('node:fs');
const path = require('node:path');
const posts = require('./october-blogs.json');
const root = path.join(__dirname, 'skincity');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const write = (name, value) => fs.writeFileSync(path.join(root, name), value);
const escape = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const date = s => new Date(`${s}T12:00:00Z`).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
const domain = 'https://www.skincityindia.in';
const template = read('blog/navratri-skincare-tips-glowing-skin/index.html');
for (const post of posts) {
  const url = `${domain}/blog/${post.slug}`;
  const image = `${domain}/${encodeURI(post.image)}`;
  const schema = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: post.title, description: post.description, image, datePublished: post.date, dateModified: post.date, author: { '@type': 'Organization', name: 'SkinCity India' }, publisher: { '@type': 'Organization', name: 'SkinCity India' }, mainEntityOfPage: { '@type': 'WebPage', '@id': url }, articleSection: post.category, keywords: post.keyword };
  let html = template.replace(/navratri-skincare-tips-glowing-skin/g, post.slug)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(post.seoTitle)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${escape(post.description)}">`)
    .replace(/<meta name="keywords"[^>]*>/, `<meta name="keywords" content="${escape(post.keyword)}">`)
    .replace(/<link rel="canonical"[^>]*>/, `<link rel="canonical" href="${url}">`);
  for (const [key, value] of Object.entries({ title: post.seoTitle, description: post.description, url, image })) {
    html = html.replace(new RegExp(`<meta property="og:${key}"[^>]*>`), `<meta property="og:${key}" content="${escape(value)}">`);
    if (key !== 'url') html = html.replace(new RegExp(`<meta name="twitter:${key}"[^>]*>`), `<meta name="twitter:${key}" content="${escape(value)}">`);
  }
  html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${JSON.stringify(schema)}</script>`)
    .replace('Navratri Skincare<br>Tips', escape(post.shortTitle))
    .replace('>Navratri Skincare Tips</li>', `>${escape(post.shortTitle)}</li>`)
    .replace('class="navratri-banner', 'class="pt-blog-banner')
    .replace(/<img src="\.\.\/\.\.\/assets\/images\/blog\/_Skin[^"]*"[^>]*>/, `<img src="/${encodeURI(post.image)}" alt="${escape(post.alt)}" class="img-fluid mb-30" style="width:100%;height:auto" decoding="async">`)
    .replace('aria-label="Navratri skincare banner"', `aria-label="${escape(post.shortTitle)} featured image"`);
  const content = `<article id="blog-content"><div class="post__meta-cat">${escape(post.category)}</div>\n<h1>${escape(post.title)}</h1><p class="post__meta"><time datetime="${post.date}">${date(post.date)}</time> &middot; SkinCity India</p>\n<p>${escape(post.intro)}</p>\n${post.sections.map(([heading, body]) => `<h2>${heading}</h2>\n${body}`).join('\n')}\n<a href="https://forms.gle/vAWi451D63qXS9Sn8" target="_blank" rel="noopener" class="btn btn__primary btn__rounded">Book a Dermatology Consultation</a>\n<p class="mt-30">Patient information reference: <a href="${post.source}" target="_blank" rel="noopener">American Academy of Dermatology</a>.</p><p><a href="/Blog">Back to all blogs</a></p></article>`;
  html = html.replace(/<article id="blog-content">[\s\S]*?<\/article>/, content);
  fs.mkdirSync(path.join(root, 'blog', post.slug), { recursive: true });
  write(`blog/${post.slug}/index.html`, html);
}

// Locate complete card columns without changing their existing markup.
function cards(html) {
  const result = [];
  const pattern = /<div class="col-sm-12 col-md-6 col-lg-4">/g;
  let match;
  while ((match = pattern.exec(html))) {
    let depth = 0;
    const tags = /<div\b[^>]*>|<\/div>/g;
    tags.lastIndex = match.index;
    let tag;
    while ((tag = tags.exec(html))) {
      depth += tag[0].startsWith('</') ? -1 : 1;
      if (!depth) break;
    }
    const value = html.slice(match.index, tags.lastIndex);
    if (value.includes('post-item')) result.push({ start: match.index, end: tags.lastIndex, html: value });
  }
  return result;
}
const card = post => `<div class="col-sm-12 col-md-6 col-lg-4"><div class="post-item"><div class="post__img"><a href="blog/${post.slug}/"><img src="${encodeURI(post.thumbnail || post.image)}" alt="${escape(post.alt)}" loading="lazy" style="display:block;width:100%;height:auto;aspect-ratio:auto;object-fit:contain"></a></div><div class="post__body"><div class="post__meta-cat"><a href="blog/${post.slug}/">${escape(post.category)}</a></div><div class="post__meta d-flex"><span class="post__meta-date">${date(post.date)}</span><a class="post__meta-author" href="blog/${post.slug}/">SkinCity India</a></div><h4 class="post__title"><a href="blog/${post.slug}/">${escape(post.title)}</a></h4><p class="post__desc">${escape(post.description)}</p><a href="blog/${post.slug}/" class="btn btn_secondary btnlink btn_rounded"><span>Read More</span><i class="icon-arrow-right"></i></a></div></div></div>`;
let listing = read('Blog.html');
const existing = cards(listing);
const all = [...existing.filter(c => !posts.some(p => c.html.includes(`blog/${p.slug}/`))).map(c => c.html), ...posts.map(card)];
const timestamp = html => Date.parse(html.match(/post__meta-date">([^<]+)/)?.[1] || '') || 0;
all.sort((a, b) => timestamp(b) - timestamp(a));
for (let i = existing.length - 1; i >= 0; i--) {
  const c = existing[i];
  const replacement = i === existing.length - 1 ? all.slice(i).join('\n') : all[i];
  listing = listing.slice(0, c.start) + replacement + listing.slice(c.end);
}
write('Blog.html', listing);
let home = read('index.html');
const homeCards = cards(home);
for (let i = homeCards.length - 1; i >= 0; i--) {
  const c = homeCards[i];
  home = home.slice(0, c.start) + all[i] + home.slice(c.end);
}
write('index.html', home);
let sitemap = read('sitemap.xml');
for (const post of posts) {
  if (!sitemap.includes(`/blog/${post.slug}</loc>`)) sitemap = sitemap.replace('</urlset>', `  <url><loc>${domain}/blog/${post.slug}</loc><lastmod>${post.date}</lastmod></url>\n</urlset>`);
}
write('sitemap.xml', sitemap);
console.log(`Generated ${posts.length} October blogs; sorted ${all.length} listing cards and ${homeCards.length} homepage cards.`);
