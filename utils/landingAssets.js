const landingImageDefaults = [
  {
    key: 'heroBefore',
    section: 'Hero',
    label: 'Hero - Avant',
    url: '/assets/beforelivingroom.jpeg',
    alt: 'Salon avant transformation'
  },
  {
    key: 'heroAfter',
    section: 'Hero',
    label: 'Hero - Après',
    url: '/assets/afterlivingingroom.jpeg',
    alt: 'Salon après transformation'
  },
  {
    key: 'styleModernArabic',
    section: 'Styles Slider',
    label: 'Style - Modern Arabic',
    url: '/assets/11houses/Modern Arabic.jpeg',
    alt: 'Modern Arabic'
  },
  {
    key: 'styleNordicBlack',
    section: 'Styles Slider',
    label: 'Style - Nordic Black',
    url: '/assets/11houses/Nordic Black.jpeg',
    alt: 'Nordic Black'
  },
  {
    key: 'styleBali',
    section: 'Styles Slider',
    label: 'Style - Bali',
    url: '/assets/11houses/Bali.jpeg',
    alt: 'Bali'
  },
  {
    key: 'styleIndustrial',
    section: 'Styles Slider',
    label: 'Style - Industrial',
    url: '/assets/11houses/Industrial.jpeg',
    alt: 'Industrial'
  },
  {
    key: 'styleLuxury',
    section: 'Styles Slider',
    label: 'Style - Luxury',
    url: '/assets/11houses/Luxury.jpeg',
    alt: 'Luxury'
  },
  {
    key: 'styleMarbre',
    section: 'Styles Slider',
    label: 'Style - Marbre',
    url: '/assets/11houses/Marbre.jpeg',
    alt: 'Marbre'
  },
  {
    key: 'styleRustic',
    section: 'Styles Slider',
    label: 'Style - Rustic',
    url: '/assets/11houses/Rustic.jpeg',
    alt: 'Rustic'
  },
  {
    key: 'styleBois',
    section: 'Styles Slider',
    label: 'Style - Bois',
    url: '/assets/11houses/Bois.jpeg',
    alt: 'Bois'
  },
  {
    key: 'styleGranite',
    section: 'Styles Slider',
    label: 'Style - Granite',
    url: '/assets/11houses/Granite.jpeg',
    alt: 'Granite'
  },
  {
    key: 'styleQuartz',
    section: 'Styles Slider',
    label: 'Style - Quartz',
    url: '/assets/11houses/Quartz.jpeg',
    alt: 'Quartz'
  },
  {
    key: 'styleIndustrialLoft',
    section: 'Styles Slider',
    label: 'Style - Industrial Loft',
    url: '/assets/11houses/Industrial2.jpeg',
    alt: 'Industrial Loft'
  },
  {
    key: 'galleryHouse1',
    section: 'Gallery',
    label: 'Galerie - Maison 1',
    url: '/assets/houeses/house1.jpeg',
    alt: 'Design maison moderne'
  },
  {
    key: 'galleryHouse2',
    section: 'Gallery',
    label: 'Galerie - Maison 2',
    url: '/assets/houeses/house2.jpeg',
    alt: 'Design maison contemporaine'
  },
  {
    key: 'galleryHouse3',
    section: 'Gallery',
    label: 'Galerie - Maison 3',
    url: '/assets/houeses/house3.jpeg',
    alt: 'Design maison luxe'
  },
  {
    key: 'galleryHouse4',
    section: 'Gallery',
    label: 'Galerie - Maison 4',
    url: '/assets/houeses/house4.jpeg',
    alt: 'Design maison villa'
  },
  {
    key: 'galleryAfterHouse',
    section: 'Gallery',
    label: 'Galerie - Extérieur rénové',
    url: '/assets/afterhouse.jpeg',
    alt: 'Design extérieur rénové'
  },
  {
    key: 'galleryAfterLiving',
    section: 'Gallery',
    label: 'Galerie - Salon design',
    url: '/assets/afterlivingingroom.jpeg',
    alt: 'Salon design'
  },
  {
    key: 'featureBefore',
    section: 'Features',
    label: 'Fonctionnalités - Avant',
    url: '/assets/beforelivingroom.jpeg',
    alt: 'Génération IA'
  },
  {
    key: 'featureAfter',
    section: 'Features',
    label: 'Fonctionnalités - Après',
    url: '/assets/afterlivingingroom.jpeg',
    alt: 'Résultat IA'
  },
  {
    key: 'showcaseLivingBefore',
    section: 'Showcase',
    label: 'Showcase - Salon avant',
    url: '/assets/afterlivingingroom.jpeg',
    alt: 'Salon avant'
  },
  {
    key: 'showcaseLivingAfter',
    section: 'Showcase',
    label: 'Showcase - Salon après',
    url: '/assets/beforelivingroom.jpeg',
    alt: 'Salon après'
  },
  {
    key: 'showcaseExteriorBefore',
    section: 'Showcase',
    label: 'Showcase - Maison avant',
    url: '/assets/beforehouse.jpeg',
    alt: 'Maison avant'
  },
  {
    key: 'showcaseExteriorAfter',
    section: 'Showcase',
    label: 'Showcase - Maison après',
    url: '/assets/afterhouse.jpeg',
    alt: 'Maison après'
  }
];

const getLandingDefaultByKey = (key) =>
  landingImageDefaults.find((item) => item.key === key);

const buildLandingImageMap = (assets = []) => {
  const assetByKey = new Map(assets.map((asset) => [asset.key, asset]));
  const map = {};

  landingImageDefaults.forEach((item) => {
    const asset = assetByKey.get(item.key);
    map[item.key] = {
      url: asset?.url || item.url,
      alt: asset?.alt || item.alt
    };
  });

  return map;
};

const mergeLandingAssetsForAdmin = (assets = []) => {
  const assetByKey = new Map(assets.map((asset) => [asset.key, asset]));
  return landingImageDefaults.map((item) => {
    const asset = assetByKey.get(item.key);
    return {
      ...item,
      url: asset?.url || item.url,
      alt: asset?.alt || item.alt,
      publicId: asset?.publicId || ''
    };
  });
};

module.exports = {
  landingImageDefaults,
  getLandingDefaultByKey,
  buildLandingImageMap,
  mergeLandingAssetsForAdmin
};

