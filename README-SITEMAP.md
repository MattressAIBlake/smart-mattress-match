# Dynamic Sitemap Generation

This project includes a dynamic sitemap generation utility that fetches all products from Shopify and generates a comprehensive sitemap with proper SEO attributes.

## Features

- ✅ Fetches all products from Shopify Storefront API with pagination
- ✅ Includes homepage, brand pages, and all product pages
- ✅ Proper priority values (1.0 for homepage, 0.9 for brands, 0.8 for products)
- ✅ Dynamic `lastmod` timestamps from Shopify product updates
- ✅ Proper `changefreq` values for better crawling
- ✅ XML format compliant with sitemaps.org schema

## Usage

### Prerequisites

Make sure you have the required environment variables set:
- `SHOPIFY_SHOP_PERMANENT_DOMAIN`
- `SHOPIFY_STOREFRONT_ACCESS_TOKEN`

These are automatically available in Lovable Cloud projects.

### Generate Sitemap

Run the sitemap generation script:

```bash
# Using Node.js
node scripts/generate-sitemap.js

# Or if you have npm scripts configured
npm run generate:sitemap
```

### Build-time Generation

To automatically generate the sitemap during build, you can add it to your build script in `package.json`:

```json
{
  "scripts": {
    "prebuild": "node scripts/generate-sitemap.js",
    "build": "vite build",
    "generate:sitemap": "node scripts/generate-sitemap.js"
  }
}
```

## Sitemap Structure

The generated sitemap includes:

1. **Homepage** (`/`)
   - Priority: 1.0
   - Change frequency: daily
   - Last modified: Current timestamp

2. **Brand Pages** (`/brand/[slug]`)
   - Priority: 0.9
   - Change frequency: weekly
   - Last modified: Current timestamp
   - Brands included:
     - Helix Sleep
     - Leesa
     - Birch Natural Mattress
     - Brooklyn Bedding Plank
     - Brooklyn Bedding

3. **Product Pages** (`/product/[handle]`)
   - Priority: 0.8
   - Change frequency: weekly
   - Last modified: Product's last update time from Shopify

## Output

The sitemap is generated at `public/sitemap.xml` and will be automatically served at `https://mattresswizard.com/sitemap.xml`.

## Monitoring

When the script runs, you'll see output like:

```
🔄 Fetching products from Shopify...
✅ Found 42 products
📝 Generating sitemap XML...
✅ Sitemap generated successfully at /path/to/public/sitemap.xml
📊 Total URLs: 48
   - Homepage: 1
   - Brand pages: 5
   - Product pages: 42
```

## Manual Updates

If you add new products or make significant changes, regenerate the sitemap:

```bash
node scripts/generate-sitemap.js
```

## Automated Updates

For production deployments, consider:
1. Running the script in your CI/CD pipeline before deployment
2. Setting up a scheduled job to regenerate the sitemap periodically
3. Triggering regeneration via webhooks when products are updated in Shopify

## SEO Benefits

This dynamic sitemap provides:
- ✅ Better search engine discoverability for all products
- ✅ Proper priority signals to crawlers
- ✅ Up-to-date modification timestamps
- ✅ Structured hierarchy understanding
- ✅ Improved crawl efficiency
