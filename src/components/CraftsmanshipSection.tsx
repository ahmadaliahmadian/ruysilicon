export function CraftsmanshipSection() {
  const pillars = [
    {
      index: '۰۱',
      title: 'کنترل کیفی در آزمایشگاه سخت‌افزار',
      description:
        'سفارش‌های اسمبل‌شده پیش از ارسال، تحت تست ۲۴ ساعته پایداری حرارتی، فشار مدار تغذیه و به‌روزرسانی بایوس قرار می‌گیرند.',
    },
    {
      index: '۰۲',
      title: 'اصالت قطعه و استعلام آنلاین سریال',
      description:
        'تمامی پردازنده‌ها، کارت‌های گرافیک و ماژول‌های حافظه مستقیماً از تامین‌کنندگان رسمی و با پلمپ معتبر کارخانه عرضه می‌شوند.',
    },
    {
      index: '۰۳',
      title: 'بسته‌بندی آنتی‌استاتیک و بیمه کامل',
      description:
        'قطعات حساس در محفظه‌های فوم فشرده ضدالکتریسیته ساکن بسته‌بندی شده و با پوشش بیمه تمام‌خطر به سراسر ایران ارسال می‌گردند.',
    },
  ];

  return (
    <section className="bg-white border-t border-neutral-200 py-14 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-xs font-semibold text-neutral-500 mb-2">
            استاندارد رایاسلیکون در تامین و اسمبل
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111315] [text-wrap:balance]">
            دقت مهندسی از انتخاب قطعه تا تحویل نهایی
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pillars.map((pillar) => (
            <div key={pillar.index} className="pt-6 border-t border-neutral-200 space-y-3">
              <span className="font-mono text-xs font-semibold text-[#1E40AF]">
                {pillar.index}
              </span>
              <h3 className="text-lg font-bold text-[#111315]">{pillar.title}</h3>
              <p className="text-sm text-neutral-600 leading-relaxed">{pillar.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
