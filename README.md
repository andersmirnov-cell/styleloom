# StyleLoom — E-commerce Store

Responsive dark-theme fashion store, built from a Figma design. The project is developed in two stages: a static frontend first, then a WordPress / WooCommerce theme based on the same markup.

**Live demo:** https://styleloom-smyrnov.netlify.app

## Repository structure

```
styleloom/
├── frontend/   # Static pages: Vite + Vituum + Nunjucks + SCSS + TypeScript
└── backend/    # WordPress / WooCommerce theme (coming soon)
```

## Frontend

A pixel-accurate implementation of an e-commerce homepage for desktop, tablet and mobile. The markup is split into layouts, partials and components, so it can be moved into WordPress templates with minimal changes.

**Sections:** header with mobile menu, hero, stats, features, shopping journey, latest collection, testimonials, FAQ, call-to-action banner, footer.

### Tech stack

- **Vite + Vituum** — build tooling and dev server
- **Nunjucks** — templates, layouts and partials
- **SCSS** — modular architecture with design tokens (CSS custom properties)
- **CSS Grid & Flexbox** — mobile-first responsive layouts
- **TypeScript** — mobile menu and UI interactions

### Features

- Three breakpoints: desktop, tablet, mobile
- Semantic HTML with a logical heading structure
- Descriptive `alt` text for content images
- Lazy-loaded images in WebP format
- No horizontal scrolling on any screen size

### Getting started

```bash
cd frontend
npm install
npm run dev      # start the dev server
npm run build    # type-check and build into /dist
npm run preview  # preview the production build
```

## Backend (coming soon)

Custom WordPress theme with WooCommerce support, built on the frontend markup: shop homepage, product catalog with category filtering, single product page, cart and checkout.

## Design credit

Design: [StyleLoom — Ecommerce Website UI Template, Dark Theme](https://www.figma.com/community/file/1365296617190133657) by Produce UI, from Figma Community.
Development: Andrii Smyrnov.

## Roadmap

- [x] Responsive homepage (frontend)
- [ ] Responsive products page (frontend)
- [ ] Responsive product details page (frontend)
- [ ] Responsive contact page (frontend)
- [ ] WordPress / WooCommerce theme (backend)
- [ ] Product category filtering via WooCommerce
- [ ] Catalog, product, cart and checkout templates
