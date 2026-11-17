import { ArrowLeft } from 'lucide-react';
import { HERO_WORKSTATION_IMAGE } from '../data/products';
import { HardwareImage } from './HardwareImage';

interface HeroSectionProps {
  onExploreCatalog: () => void;
  onOpenBuilder: () => void;
}

const ASSURANCE_ITEMS = [
  {
    code: '۰۱',
    title: 'ضمانت اصالت و پلمپ کارخانه',
    detail: 'تمامی قطعات با هولوگرام و استعلام سریال معتبر عرضه می‌شوند',
  },
  {
    code: '۰۲',
    title: 'تست پایداری قبل از ارسال',
    detail: 'امکان دریافت گزارش تست حرارتی و فرکانس پیش از بسته‌بندی',
  },
  {
    code: '۰۳',
    title: 'ارسال بیمه‌شده سراسر کشور',
    detail: 'تحویل اکسپرس تهران و بسته‌بندی ضدضربه برای شهرستان‌ها',
  },
  {
    code: '۰۴',
    title: 'بررسی دقیق سازگاری قطعات',
    detail: 'کنترل سوکت، توان مصرفی و ابعاد کیس در بخش اسمبل هوشمند',
  },
];

export function HeroSection({ onExploreCatalog, onOpenBuilder }: HeroSectionProps) {
  return (
    <section className="bg-[#111315] text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
          {/* Editorial Copy Column */}
          <div className="lg:col-span-5 flex flex-col justify-center">
            <p className="text-xs font-semibold tracking-wide text-neutral-400 mb-4">
              مهندسی سخت‌افزار · نسل جدید پردازش و رندرینگ
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-bold leading-[1.3] text-white mb-5 [text-wrap:balance]">
              قطعات مرجع برای سیستم‌های بی‌نقص
            </h1>
            <p className="text-base text-neutral-300 leading-relaxed max-w-xl mb-8">
              مجموعه‌ای دست‌چین‌شده از کارت‌های گرافیک نسل جدید، پردازنده‌های رده ورک‌استیشن،
              مادربردهای سری پرچم‌دار و تجهیزات تغذیه تیتانیوم با بررسی لحظه‌ای سازگاری و ارسال بیمه‌شده.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onExploreCatalog}
                className="inline-flex items-center gap-2.5 px-6 py-3 min-h-[44px] bg-[#1E40AF] hover:bg-[#1D4ED8] text-white text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
              >
                <span>مشاهده کاتالوگ قطعات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onOpenBuilder}
                className="inline-flex items-center gap-2 px-5 py-3 min-h-[44px] border border-neutral-700 hover:border-neutral-500 text-neutral-200 hover:text-white text-sm font-semibold rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>اسمبل هوشمند سیستم</span>
              </button>
            </div>
          </div>

          {/* Studio Showcase Column */}
          <div className="lg:col-span-7">
            <div className="relative h-full min-h-[260px] sm:min-h-[360px] rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800">
              <HardwareImage
                src={HERO_WORKSTATION_IMAGE}
                alt="ورک‌استیشن تخصصی رایاسلیکون با بدنه آلومینیوم مشکی مات و کارت گرافیک مهندسی"
                title="ورک‌استیشن مرجع رایاسلیکون"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent pointer-events-none" />
              <div className="absolute bottom-4 right-4 left-4 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-200">
                <span className="font-medium">پیکربندی مرجع ۲۰۲۵ · سری رندر و محاسبات</span>
                <span className="font-mono tabular-nums text-neutral-300">RTX 5090 · Ultra 9 · 1200W Titanium</span>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Width 4-Column Hardware Assurance Strip */}
        <div className="mt-10 pt-8 border-t border-neutral-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ASSURANCE_ITEMS.map((item) => (
            <div key={item.code} className="space-y-1.5">
              <div className="flex items-center gap-2.5">
                <span className="font-mono tabular-nums text-xs text-[#60A5FA]">{item.code}</span>
                <h2 className="text-sm font-semibold text-white">{item.title}</h2>
              </div>
              <p className="text-xs text-neutral-400 leading-relaxed">{item.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
