import fs from 'fs';
import path from 'path';

// Shopify configuration
const SHOPIFY_STORE_PERMANENT_DOMAIN = process.env.SHOPIFY_SHOP_PERMANENT_DOMAIN || 'smart-mattress-match-4z87c.myshopify.com';
const SHOPIFY_STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || '';
const SHOPIFY_API_VERSION = '2025-07';
const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;

// Site configuration
const SITE_URL = 'https://mattresswizard.com';

// Brand pages
const BRANDS = [
  { slug: 'helix', name: 'Helix Sleep' },
  { slug: 'leesa', name: 'Leesa' },
  { slug: 'birch', name: 'Birch Natural Mattress' },
  { slug: 'plank', name: 'Brooklyn Bedding Plank' },
  { slug: 'brooklyn-bedding', name: 'Brooklyn Bedding' },
];

interface ShopifyProduct {
  handle: string;
  updatedAt: string;
}

// Fetch products from Shopify
async function fetchAllProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query GetAllProducts($first: Int!, $after: String) {
      products(first: $first, after: $after) {
        edges {
          cursor
          node {
            handle
            updatedAt
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const products: ShopifyProduct[] = [];
  let hasNextPage = true;
  let cursor: string | null = null;

  try {
    while (hasNextPage) {
      const response = await fetch(SHOPIFY_STOREFRONT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: {
            first: 50,
            after: cursor,
          },
        }),
      });

      const data = await response.json();
      
      if (data.errors) {
        console.error('Shopify API errors:', data.errors);
        break;
      }

      const edges = data.data.products.edges;
      products.push(...edges.map((edge: any) => edge.node));

      hasNextPage = data.data.products.pageInfo.hasNextPage;
      cursor = data.data.products.pageInfo.endCursor;
    }
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  return products;
}

// Format date to ISO 8601 format
function formatDate(date: Date | string): string {
  return new Date(date).toISOString();
}

// Generate sitemap XML
function generateSitemapXML(products: ShopifyProduct[]): string {
  const now = formatDate(new Date());
  
  const urls: Array<{ loc: string; lastmod: string; priority: string; changefreq: string }> = [];

  // Homepage
  urls.push({
    loc: SITE_URL,
    lastmod: now,
    priority: '1.0',
    changefreq: 'daily',
  });

  // Brand pages
  BRANDS.forEach(brand => {
    urls.push({
      loc: `${SITE_URL}/brand/${brand.slug}`,
      lastmod: now,
      priority: '0.9',
      changefreq: 'weekly',
    });
  });

  // Product pages
  products.forEach(product => {
    urls.push({
      loc: `${SITE_URL}/product/${product.handle}`,
      lastmod: formatDate(product.updatedAt),
      priority: '0.8',
      changefreq: 'weekly',
    });
  });

  // Generate XML
  const urlElements = urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urlElements}
</urlset>`;
}

// Main function
async function generateSitemap() {
  console.log('🔄 Fetching products from Shopify...');
  const products = await fetchAllProducts();
  console.log(`✅ Found ${products.length} products`);

  console.log('📝 Generating sitemap XML...');
  const sitemapXML = generateSitemapXML(products);

  const sitemapPath = path.join(process.cwd(), 'public', 'sitemap.xml');
  fs.writeFileSync(sitemapPath, sitemapXML, 'utf8');
  
  console.log(`✅ Sitemap generated successfully at ${sitemapPath}`);
  console.log(`📊 Total URLs: ${products.length + BRANDS.length + 1}`);
  console.log(`   - Homepage: 1`);
  console.log(`   - Brand pages: ${BRANDS.length}`);
  console.log(`   - Product pages: ${products.length}`);
}

// Run the script
generateSitemap().catch(error => {
  console.error('❌ Error generating sitemap:', error);
  process.exit(1);
});
