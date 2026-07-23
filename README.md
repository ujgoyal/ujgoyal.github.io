# Ujjwal Goyal — Portfolio (React + Vite)

Production portfolio deployed to **https://ujgoyal.github.io**.
All editable content lives in `src/data/*.js` — change those, never the components.

## Develop
```
npm install
npm run dev      # http://localhost:5173
npm run build    # -> dist/
npm run preview
```

## Deploy (GitHub Pages, user site)
1. Repo must be named exactly `ujgoyal.github.io`.
2. Push to `main`.
3. Settings -> Pages -> Source -> "GitHub Actions".
4. Auto-builds on every push. Live at https://ujgoyal.github.io

`vite.config.js` uses `base: '/'` because this is a user site served at the domain root.

## SEO checklist (in index.html + /public)
- Title, description, canonical, robots: index.html <head>
- Open Graph + Twitter card: index.html
- JSON-LD Person: index.html (update the LinkedIn/GitHub URLs in "sameAs")
- Social preview image: /public/og-image.svg  ->  EXPORT to /public/og-image.png (1200x630)
- robots.txt + sitemap.xml: /public
- Verify in Google Search Console after going live.

## Adding assets
- Resume: put resume.pdf in /public, set profile.resumeUrl = '/resume.pdf'
- Art/Travel images: /public/art and /public/travel, then set each item's `image`
- Music: /public/music, set each track's `src`
- Custom domain: add /public/CNAME with your domain + configure DNS
