import { HardwareCategory, HardwareProduct } from '../types/hardware';

export const CATEGORY_LABELS: Record<HardwareCategory | 'all', string> = {
  all: 'همه قطعات',
  gpu: 'کارت گرافیک',
  cpu: 'پردازنده',
  motherboard: 'مادربرد',
  ram: 'حافظه رم',
  ssd: 'حافظه SSD',
  cooler: 'خنک‌کننده',
  psu: 'منبع تغذیه',
};

export const HERO_WORKSTATION_IMAGE = '/src/assets/images/hero_workstation_pc_1794894772936.jpg';

export const HARDWARE_PRODUCTS: HardwareProduct[] = [
  {
    id: 'gpu-rtx-5090-foundry',
    sku: 'RS-GPU-5090',
    title: 'کارت گرافیک NVIDIA GeForce RTX 5090 Foundry 32GB',
    brand: 'NVIDIA',
    category: 'gpu',
    categoryLabel: 'کارت گرافیک',
    price: 238000000,
    stockCount: 4,
    warranty: '۳۶ ماه گارانتی رسمی رایاسلیکون',
    image: '/src/assets/images/gpu_flagship_studio_1794894773344.jpg',
    shortSpecs: '32GB GDDR7 · PCIe 5.0 · 575W',
    description:
      'پرچم‌دار نسل جدید گرافیک‌های معماری Blackwell با ۳۲ گیگابایت حافظه فوق‌سریع GDDR7، سیستم خنک‌کننده محفظه بخار مسی و بدنه ماشین‌کاری شده آلومینیومی برای رندرینگ سه‌بعدی، هوش مصنوعی و گیمینگ 4K/8K.',
    specs: [
      { label: 'حجم و نوع حافظه', value: '32GB GDDR7 (512-bit)' },
      { label: 'رابط اتصال', value: 'PCI Express 5.0 x16' },
      { label: 'توان مصرفی (TDP)', value: '575W' },
      { label: 'خروجی تصویر', value: '3x DisplayPort 2.1b · 1x HDMI 2.1b' },
      { label: 'منبع تغذیه پیشنهادی', value: '1000W ATX 3.1' },
    ],
    compatibility: {
      wattDraw: 575,
      formFactor: '3.5-Slot ATX',
    },
    variants: [
      { id: 'std', label: 'نسخه استاندارد با گارانتی ۳۶ ماهه', priceDelta: 0 },
      { id: 'pro', label: 'نسخه تست بنچمارک + خمیر حرارتی مایع', priceDelta: 4500000 },
    ],
  },
  {
    id: 'gpu-rtx-5080-tuf',
    sku: 'RS-GPU-5080',
    title: 'کارت گرافیک ASUS TUF Gaming RTX 5080 OC 16GB',
    brand: 'ASUS',
    category: 'gpu',
    categoryLabel: 'کارت گرافیک',
    price: 114500000,
    originalPrice: 119000000,
    stockCount: 9,
    warranty: '۳۶ ماه گارانتی سازگار ارقام',
    image: '/src/assets/images/gpu_flagship_studio_1794894773344.jpg',
    shortSpecs: '16GB GDDR7 · PCIe 5.0 · 360W',
    description:
      'کارت گرافیک رده‌بالای سری TUF با خازن‌های گرید نظامی، فن‌های Axial-tech بلبرینگی و اورکلاک کارخانه‌ای برای اجرای پایدار پروژه‌های سنگین گرافیکی و بازی‌های روز.',
    specs: [
      { label: 'حجم و نوع حافظه', value: '16GB GDDR7 (256-bit)' },
      { label: 'فرکانس بوست', value: '2685 MHz (OC Mode)' },
      { label: 'توان مصرفی (TDP)', value: '360W' },
      { label: 'کانکتور برق', value: '1x 16-pin 12V-2x6' },
      { label: 'منبع تغذیه پیشنهادی', value: '850W' },
    ],
    compatibility: {
      wattDraw: 360,
      formFactor: '3.1-Slot ATX',
    },
    variants: [
      { id: 'std', label: 'نسخه کارخانه‌ای پلمپ', priceDelta: 0 },
    ],
  },
  {
    id: 'cpu-core-ultra-9-285k',
    sku: 'RS-CPU-285K',
    title: 'پردازنده Intel Core Ultra 9 285K Arrow Lake',
    brand: 'Intel',
    category: 'cpu',
    categoryLabel: 'پردازنده',
    price: 43900000,
    stockCount: 11,
    warranty: '۲۴ ماه گارانتی تعویض بی‌قیدوشرط',
    image: '/src/assets/images/cpu_processor_studio_1794894774853.jpg',
    shortSpecs: '24 Cores · 5.7 GHz · LGA1851',
    description:
      'پردازنده پرچم‌دار دسکتاپ اینتل با ۲۴ هسته ترکیبی (۸ هسته پرفورمنس و ۱۶ هسته بهینه)، واحد پردازش عصبی NPU مجتمع و مصرف انرژی بهینه روی سوکت LGA1851.',
    specs: [
      { label: 'تعداد هسته / رشته', value: '24 Cores (8P + 16E) / 24 Threads' },
      { label: 'حداکثر فرکانس بوست', value: '5.7 GHz' },
      { label: 'حافظه کش L3 + L2', value: '36MB L3 · 40MB L2' },
      { label: 'سوکت سازگار', value: 'LGA1851' },
      { label: 'توان حرارتی پایه / حداکثر', value: '125W / 250W' },
    ],
    compatibility: {
      socket: 'LGA1851',
      ramType: 'DDR5',
      wattDraw: 250,
    },
    variants: [
      { id: 'box', label: 'پکیج باکس اورجینال', priceDelta: 0 },
      { id: 'tray', label: 'نسخه Tray تست‌شده', priceDelta: -1800000 },
    ],
  },
  {
    id: 'cpu-ryzen-9-9950x',
    sku: 'RS-CPU-9950X',
    title: 'پردازنده AMD Ryzen 9 9950X Zen 5',
    brand: 'AMD',
    category: 'cpu',
    categoryLabel: 'پردازنده',
    price: 45200000,
    stockCount: 7,
    warranty: '۲۴ ماه گارانتی رسمی آواژنگ',
    image: '/src/assets/images/cpu_processor_studio_1794894774853.jpg',
    shortSpecs: '16C/32T · 5.7 GHz · AM5',
    description:
      'قدرتمندترین پردازنده ورک‌استیشن و تدوین معماری Zen 5 با ۱۶ هسته واقعی، ۳۲ رشته پردازشی، پشتیبانی کامل از دستورالعمل‌های AVX-512 و PCIe 5.0.',
    specs: [
      { label: 'تعداد هسته / رشته', value: '16 Cores / 32 Threads' },
      { label: 'فرکانس پایه / بوست', value: '4.3 GHz / 5.7 GHz' },
      { label: 'مجموع حافظه کش', value: '80MB (64MB L3 + 16MB L2)' },
      { label: 'سوکت سازگار', value: 'AM5' },
      { label: 'توان حرارتی (TDP)', value: '170W' },
    ],
    compatibility: {
      socket: 'AM5',
      ramType: 'DDR5',
      wattDraw: 200,
    },
    variants: [
      { id: 'box', label: 'پکیج باکس اورجینال', priceDelta: 0 },
    ],
  },
  {
    id: 'cpu-ryzen-7-9800x3d',
    sku: 'RS-CPU-9800X3D',
    title: 'پردازنده AMD Ryzen 7 9800X3D 3D V-Cache',
    brand: 'AMD',
    category: 'cpu',
    categoryLabel: 'پردازنده',
    price: 37800000,
    stockCount: 6,
    warranty: '۲۴ ماه گارانتی رسمی',
    image: '/src/assets/images/cpu_processor_studio_1794894774853.jpg',
    shortSpecs: '8C/16T · 96MB L3 · AM5',
    description:
      'سریع‌ترین پردازنده گیمینگ جهان با نسل دوم فناوری 3D V-Cache، قابلیت اورکلاک آزاد و دمای عملیاتی کنترل‌شده برای بالاترین نرخ فریم در بازی‌های رقابتی.',
    specs: [
      { label: 'تعداد هسته / رشته', value: '8 Cores / 16 Threads' },
      { label: 'فرکانس پایه / بوست', value: '4.7 GHz / 5.2 GHz' },
      { label: 'حافظه کش L3', value: '96MB 3D V-Cache' },
      { label: 'سوکت سازگار', value: 'AM5' },
      { label: 'توان حرارتی (TDP)', value: '120W' },
    ],
    compatibility: {
      socket: 'AM5',
      ramType: 'DDR5',
      wattDraw: 140,
    },
    variants: [
      { id: 'box', label: 'پکیج باکس اورجینال', priceDelta: 0 },
    ],
  },
  {
    id: 'mb-rog-maximus-z890',
    sku: 'RS-MB-Z890',
    title: 'مادربرد ASUS ROG Maximus Z890 Hero',
    brand: 'ASUS',
    category: 'motherboard',
    categoryLabel: 'مادربرد',
    price: 49500000,
    stockCount: 5,
    warranty: '۳۶ ماه گارانتی الماس رایان ایرانیان',
    image: '/src/assets/images/motherboard_atx_studio_1794894774876.jpg',
    shortSpecs: 'LGA1851 · DDR5 · 6x M.2 · Wi-Fi 7',
    description:
      'مادربرد مهندسی‌شده برای پردازنده‌های Core Ultra سری ۲۰۰ با مدار تغذیه ۲۲+۱+۲+۲ فازی ۱۱۰ آمپری، ۶ اسلات M.2، دو پورت Thunderbolt 4 و شبکه Wi-Fi 7.',
    specs: [
      { label: 'سوکت و چیپست', value: 'LGA1851 / Intel Z890' },
      { label: 'پشتیبانی حافظه', value: '4x DIMM DDR5 up to 9200+ MT/s (192GB)' },
      { label: 'اسلات‌های ذخیره‌سازی', value: '6x M.2 (3x PCIe 5.0) · 4x SATA' },
      { label: 'شبکه و ارتباطات', value: 'Wi-Fi 7 · 5Gb + 2.5Gb LAN · 2x TB4' },
      { label: 'فرم فاکتور', value: 'ATX' },
    ],
    compatibility: {
      socket: 'LGA1851',
      ramType: 'DDR5',
      wattDraw: 45,
      formFactor: 'ATX',
    },
    variants: [
      { id: 'std', label: 'نسخه استاندارد ATX', priceDelta: 0 },
    ],
  },
  {
    id: 'mb-asrock-x870e-taichi',
    sku: 'RS-MB-X870E',
    title: 'مادربرد ASRock X870E Taichi EATX',
    brand: 'ASRock',
    category: 'motherboard',
    categoryLabel: 'مادربرد',
    price: 39400000,
    originalPrice: 41800000,
    stockCount: 8,
    warranty: '۳۶ ماه گارانتی الماس رایان',
    image: '/src/assets/images/motherboard_atx_studio_1794894774876.jpg',
    shortSpecs: 'AM5 · DDR5 · 24+2+1 VRM · USB4',
    description:
      'مادربرد رده‌بالای پلتفرم AM5 با بورد ۸ لایه، مدار تغذیه ۲۴+۲+۱ فازی ۱۱۰ آمپری، سیستم خنک‌کننده یکپارچه VRM و دو درگاه USB4 با سرعت ۴۰ گیگابیت بر ثانیه.',
    specs: [
      { label: 'سوکت و چیپست', value: 'AM5 / AMD X870E' },
      { label: 'پشتیبانی حافظه', value: '4x DIMM DDR5 up to 8200+ MT/s (256GB)' },
      { label: 'اسلات‌های M.2', value: '4x M.2 (1x Blazing PCIe 5.0)' },
      { label: 'مدار تغذیه', value: '24+2+1 Phase 110A SPS' },
      { label: 'فرم فاکتور', value: 'E-ATX' },
    ],
    compatibility: {
      socket: 'AM5',
      ramType: 'DDR5',
      wattDraw: 45,
      formFactor: 'E-ATX',
    },
    variants: [
      { id: 'std', label: 'نسخه اصلی پلمپ', priceDelta: 0 },
    ],
  },
  {
    id: 'ram-gskill-trident-64gb',
    sku: 'RS-RAM-TZ5-64',
    title: 'کیت حافظه رم G.Skill Trident Z5 64GB DDR5-6400',
    brand: 'G.Skill',
    category: 'ram',
    categoryLabel: 'حافظه رم',
    price: 19800000,
    stockCount: 14,
    warranty: 'گارانتی مادام‌العمر آواژنگ',
    image: '/src/assets/images/ram_ddr5_studio_1794894775396.jpg',
    shortSpecs: '64GB (2x32) · 6400 MT/s · CL32',
    description:
      'کیت دوکاناله ۶۴ گیگابایتی با هیت‌سینک آلومینیومی آنودایز شده مات، زمان تاخیر پایین CL32 و تراشه‌های دست‌چین‌شده Hynix A-Die برای حداکثر پایداری در رندر و پردازش داده.',
    specs: [
      { label: 'ظرفیت کیت', value: '64GB (2x 32GB Dual Channel)' },
      { label: 'فرکانس و استاندارد', value: 'DDR5-6400 MT/s (PC5-51200)' },
      { label: 'زمان تاخیر (Timings)', value: 'CL32-39-39-102' },
      { label: 'ولتاژ کاری', value: '1.40V (XMP 3.0 / EXPO)' },
      { label: 'جنس هیت‌سینک', value: 'آلومینیوم برس‌خورده تیتانیوم' },
    ],
    compatibility: {
      ramType: 'DDR5',
      wattDraw: 12,
    },
    variants: [
      { id: '64gb', label: 'کیت ۶۴ گیگابایت (۲×۳۲)', priceDelta: 0 },
      { id: '32gb', label: 'کیت ۳۲ گیگابایت (۲×۱۶)', priceDelta: -8900000 },
    ],
  },
  {
    id: 'ssd-crucial-t705-2tb',
    sku: 'RS-SSD-T705-2T',
    title: 'حافظه اس‌اس‌دی Crucial T705 2TB PCIe 5.0 NVMe',
    brand: 'Crucial',
    category: 'ssd',
    categoryLabel: 'حافظه SSD',
    price: 18400000,
    stockCount: 16,
    warranty: '۳۶ ماه گارانتی اصلی',
    image: '/src/assets/images/ssd_nvme_studio_1794894775290.jpg',
    shortSpecs: '2TB · Gen5 x4 · 14,500 MB/s',
    description:
      'سریع‌ترین درایو SSD نسل پنجم با سرعت خواندن متوالی ۱۴,۵۰۰ مگابایت بر ثانیه، مجهز به هیت‌سینک آلومینیومی پره‌دار اختصاصی برای دفع حرارت بدون افت عملکرد.',
    specs: [
      { label: 'ظرفیت', value: '2TB (M.2 2280)' },
      { label: 'رابط و کنترلر', value: 'PCIe Gen5 x4 NVMe 2.0' },
      { label: 'سرعت خواندن / نوشتن', value: '14,500 / 12,700 MB/s' },
      { label: 'عمر نوشتن (TBW)', value: '1,200 TBW' },
      { label: 'خنک‌کننده', value: 'هیت‌سینک ماشین‌کاری‌شده یکپارچه' },
    ],
    compatibility: {
      wattDraw: 10,
      formFactor: 'M.2 2280',
    },
    variants: [
      { id: '2tb', label: 'ظرفیت ۲ ترابایت با هیت‌سینک', priceDelta: 0 },
      { id: '4tb', label: 'ظرفیت ۴ ترابایت با هیت‌سینک', priceDelta: 17200000 },
    ],
  },
  {
    id: 'cooler-rog-strix-360',
    sku: 'RS-CLR-LC360',
    title: 'خنک‌کننده مایع ASUS ROG Strix LC III 360mm',
    brand: 'ASUS',
    category: 'cooler',
    categoryLabel: 'خنک‌کننده',
    price: 17600000,
    stockCount: 10,
    warranty: '۳۶ ماه گارانتی تعویض',
    image: '/src/assets/images/cooler_liquid_studio_1794894776212.jpg',
    shortSpecs: '360mm AIO · Asetek Gen7 V2 · LGA1851/AM5',
    description:
      'واترکولر سه‌فنه ۳۶۰ میلی‌متری با پمپ نسل هفتم Asetek V2، لوله‌های بافته EPDM مقاوم در برابر تبخیر و کلدپلیت تمام‌مس برای کنترل کامل دمای پردازنده‌های پرمصرف.',
    specs: [
      { label: 'اندازه رادیاتور', value: '360mm (394 × 121 × 27 mm)' },
      { label: 'پمپ و بلاک', value: 'Asetek Gen7 V2 · صفحه تماس مسی' },
      { label: 'فن‌ها', value: '3x 120mm PWM High Static Pressure' },
      { label: 'میزان صدا (حداکثر)', value: '36 dB(A)' },
      { label: 'پشتیبانی سوکت', value: 'LGA1851 · LGA1700 · AM5 · AM4' },
    ],
    compatibility: {
      wattDraw: 15,
      formFactor: '360mm Radiator',
    },
    variants: [
      { id: '360', label: 'رادیاتور ۳۶۰ میلی‌متری مشکی مات', priceDelta: 0 },
    ],
  },
  {
    id: 'psu-corsair-hx1200i',
    sku: 'RS-PSU-HX1200I',
    title: 'منبع تغذیه Corsair HX1200i 1200W 80+ Titanium',
    brand: 'Corsair',
    category: 'psu',
    categoryLabel: 'منبع تغذیه',
    price: 24900000,
    stockCount: 12,
    warranty: '۶۰ ماه گارانتی طلایی الماس',
    image: '/src/assets/images/psu_titanium_studio_1794894776792.jpg',
    shortSpecs: '1200W · 80+ Titanium · ATX 3.1',
    description:
      'پاور تمام‌ماژولار ۱۲۰۰ وات با راندمان تیتانیوم (۹۴٪)، کابل اختصاصی 12V-2x6 برای گرافیک‌های سری ۵۰، خازن‌های تمام ژاپنی ۱۰۵ درجه و فن بی‌صدای Zero RPM.',
    specs: [
      { label: 'توان خروجی واقعی', value: '1200W Continuous' },
      { label: 'گواهینامه راندمان', value: '80 PLUS Titanium (تا ۹۴٪ راندمان)' },
      { label: 'استاندارد', value: 'ATX 3.1 & PCIe 5.1 Ready' },
      { label: 'نوع کابل‌کشی', value: 'تمام ماژولار با روکش بافته' },
      { label: 'حالت بی‌صدا', value: 'Zero RPM Fan Mode تا بار ۵۰٪' },
    ],
    compatibility: {
      psuWattage: 1200,
      formFactor: 'ATX',
    },
    variants: [
      { id: '1200w', label: 'مدل ۱۲۰۰ وات تیتانیوم', priceDelta: 0 },
      { id: '1500w', label: 'مدل ۱۵۰۰ وات تیتانیوم', priceDelta: 6800000 },
    ],
  },
];

export function formatToman(amount: number): string {
  return `${new Intl.NumberFormat('fa-IR').format(Math.round(amount))} تومان`;
}

export function formatPersianNumber(value: number): string {
  return new Intl.NumberFormat('fa-IR').format(value);
}

export function getProductById(id: string): HardwareProduct | undefined {
  return HARDWARE_PRODUCTS.find((item) => item.id === id);
}

export function getProductEffectivePrice(product: HardwareProduct, variantId?: string): number {
  const variant = product.variants.find((v) => v.id === variantId);
  return product.price + (variant?.priceDelta ?? 0);
}
