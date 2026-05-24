import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/kas/', '/notifikasi/', '/profil/', '/pesan/', '/teman/', '/peminjaman/'], // Protect app routes from crawlers
    },
    sitemap: 'https://teraswarga.com/sitemap.xml',
  }
}
