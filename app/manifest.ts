import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Esnaad',
    short_name: 'Esnaad',
    description: 'اسناد للتطوير العقاري: خبرة أكثر من 20 عاماً في بناء مجتمعات سكنية فاخرة في دبي، حيث تلتقي الأناقة بالجودة في كل مشروع. ',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#000000',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
