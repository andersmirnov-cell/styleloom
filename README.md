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

A pixel-accurate implementation of an e-commerce store for desktop, tablet and mobile. The markup is split into layouts, partials and reusable components, so it can be moved into WordPress templates with minimal changes.

### Pages

- **Home** (`index.html`) — header with mobile menu, hero, stats, features, shopping journey, latest collection, testimonials, FAQ, call-to-action banner, footer.
- **Products** (`products.html`) — category filter tabs (All / Mens / Womens / Kids) and product grids grouped by category (dresses, accessories, bags), each with a "View All" link and a "load more" toggle on mobile.
- **Product details** (`product.html`) — image gallery, stock badge, materials and care, features list, price, available sizes, ratings breakdown.
- **Contact** (`contact.html`) — contact cards (email, phone, location), return policy and cancellation policy blocks.

Products, Product details and Contact pages share the testimonials, FAQ and call-to-action sections with the homepage.

### Reusable parts

- `data/products.njk` — shared product data used by both the homepage collection and the products page
- `components/product-card.njk` — product card rendered from the shared data
- `components/policy.njk` — policy block driven by a config object (title, link, items)
- `components/icon-circle.njk`, `components/button.njk` and other UI components

### Tech stack

- **Vite + Vituum** — build tooling and dev server
- **Nunjucks** — templates, layouts and partials
- **SCSS** — modular architecture with design tokens (CSS custom properties)
- **CSS Grid & Flexbox** — mobile-first responsive layouts
- **TypeScript** — mobile menu, mobile grid "load more", marquee, animated counters

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
- [x] Responsive products page (frontend)
- [x] Responsive product details page (frontend)
- [x] Responsive contact page (frontend)
- [ ] WordPress / WooCommerce theme (backend)
- [ ] Product category filtering via WooCommerce
- [ ] Catalog, product, cart and checkout templates
