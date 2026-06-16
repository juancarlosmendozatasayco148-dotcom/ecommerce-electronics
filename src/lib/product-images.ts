const productImageMap: Record<string, string[]> = {
  'laptop-asus-vivobook-go-15': [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600&h=600&fit=crop',
  ],
  'lenovo-ideapad-slim-3': [
    'https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
  ],
  'macbook-air-m3-15': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600&h=600&fit=crop',
  ],
  'xiaomi-redmi-note-13': [
    'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
  ],
  'samsung-galaxy-a55': [
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1523206489230-c012c64b2b48?w=600&h=600&fit=crop',
  ],
  'iphone-16-128gb': [
    'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&h=600&fit=crop',
  ],
  'samsung-galaxy-s25-ultra': [
    'https://images.unsplash.com/photo-1611523658822-385aa008324c?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=600&h=600&fit=crop',
  ],
  'xiaomi-redmi-buds-5-pro': [
    'https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=600&h=600&fit=crop',
  ],
  'jbl-tune-770nc': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
  ],
  'sony-wh-1000xm5': [
    'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
  ],
  'xiaomi-pad-6': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop',
  ],
  'ipad-10ma-gen': [
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&h=600&fit=crop',
  ],
  'xiaomi-smart-band-9': [
    'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&h=600&fit=crop',
  ],
  'samsung-galaxy-watch-7': [
    'https://images.unsplash.com/photo-1546868871-af0de0ae72d1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600&h=600&fit=crop',
  ],
  'apple-watch-series-10': [
    'https://images.unsplash.com/photo-1546868871-af0de0ae72d1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1624096104997-5acebf6e9e8a?w=600&h=600&fit=crop',
  ],
  'cargador-xiaomi-67w-gan': [
    'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop',
  ],
  'mouse-logitech-m240': [
    'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&h=600&fit=crop',
  ],
  'teclado-redragon-k552': [
    'https://images.unsplash.com/photo-1541140532154-b024d1c0b78e?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&h=600&fit=crop',
  ],
  'funda-samsung-s25': [
    'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600&h=600&fit=crop',
  ],
  'parlante-jbl-go-4': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ],
  'parlante-jbl-charge-6': [
    'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ],
  'soundbar-samsung-hw-b550': [
    'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=600&h=600&fit=crop',
  ],
  'monitor-samsung-24-ips': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
  ],
  'monitor-samsung-odyssey-g5': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop',
    'https://images.unsplash.com/photo-1550837368-506e2c142479?w=600&h=600&fit=crop',
  ],
};

export function getProductImages(slug: string): string[] {
  return productImageMap[slug] || [
    'https://images.unsplash.com/photo-1550009158-9ebf691452e3?w=600&h=600&fit=crop',
  ];
}

export function getFirstProductImage(slug: string): string {
  const images = getProductImages(slug);
  return images[0];
}
