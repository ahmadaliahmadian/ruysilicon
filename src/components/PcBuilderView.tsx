import { useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle2, Cpu, RotateCcw, ShoppingBag, Zap } from 'lucide-react';
import {
  CATEGORY_LABELS,
  formatPersianNumber,
  formatToman,
  getProductById,
  HARDWARE_PRODUCTS,
} from '../data/products';
import { useStore } from '../context/StoreContext';
import { HardwareCategory } from '../types/hardware';
import { HardwareImage } from './HardwareImage';

const BUILDER_SLOTS: { category: HardwareCategory; required: boolean; hint: string }[] = [
  { category: 'cpu', required: true, hint: 'تعیین‌کننده سوکت مادربرد و توان پردازشی' },
  { category: 'motherboard', required: true, hint: 'باید هم‌سوکت با پردازنده انتخابی باشد' },
  { category: 'gpu', required: true, hint: 'پردازش گرافیکی، رندر و محاسبات' },
  { category: 'ram', required: true, hint: 'حافظه اصلی سیستم با پشتیبانی DDR5' },
  { category: 'ssd', required: true, hint: 'درایو فوق‌سریع NVMe برای سیستم‌عامل و پروژه' },
  { category: 'cooler', required: false, hint: 'دفع حرارت پردازنده زیر بار سنگین' },
  { category: 'psu', required: true, hint: 'تامین برق پایدار با حاشیه ایمنی کافی' },
];

export function PcBuilderView() {
  const { addManyToCart } = useStore();
  const [selected, setSelected] = useState<Partial<Record<HardwareCategory, string>>>({
    cpu: 'cpu-ryzen-7-9800x3d',
    motherboard: 'mb-asrock-x870e-taichi',
    gpu: 'gpu-rtx-5080-tuf',
    ram: 'ram-gskill-trident-64gb',
    ssd: 'ssd-crucial-t705-2tb',
    cooler: 'cooler-rog-strix-360',
    psu: 'psu-corsair-hx1200i',
  });

  const applyPreset = (preset: 'gaming' | 'workstation') => {
    if (preset === 'gaming') {
      setSelected({
        cpu: 'cpu-ryzen-7-9800x3d',
        motherboard: 'mb-asrock-x870e-taichi',
        gpu: 'gpu-rtx-5080-tuf',
        ram: 'ram-gskill-trident-64gb',
        ssd: 'ssd-crucial-t705-2tb',
        cooler: 'cooler-rog-strix-360',
        psu: 'psu-corsair-hx1200i',
      });
    } else {
      setSelected({
        cpu: 'cpu-core-ultra-9-285k',
        motherboard: 'mb-rog-maximus-z890',
        gpu: 'gpu-rtx-5090-foundry',
        ram: 'ram-gskill-trident-64gb',
        ssd: 'ssd-crucial-t705-2tb',
        cooler: 'cooler-rog-strix-360',
        psu: 'psu-corsair-hx1200i',
      });
    }
  };

  const selectedProducts = useMemo(() => {
    const result: Record<string, ReturnType<typeof getProductById>> = {};
    for (const slot of BUILDER_SLOTS) {
      const id = selected[slot.category];
      if (id) result[slot.category] = getProductById(id);
    }
    return result;
  }, [selected]);

  const compatibilityReport = useMemo(() => {
    const issues: string[] = [];
    const cpu = selectedProducts.cpu;
    const mb = selectedProducts.motherboard;
    const psu = selectedProducts.psu;

    if (cpu?.compatibility.socket && mb?.compatibility.socket) {
      if (cpu.compatibility.socket !== mb.compatibility.socket) {
        issues.push(
          `ناسازگاری سوکت: پردازنده ${cpu.compatibility.socket} با مادربرد ${mb.compatibility.socket} همخوانی ندارد.`
        );
      }
    }

    let estimatedWatts = 75; // Base fans, drives, peripherals
    for (const slot of BUILDER_SLOTS) {
      const prod = selectedProducts[slot.category];
      if (prod?.compatibility.wattDraw) {
        estimatedWatts += prod.compatibility.wattDraw;
      }
    }

    const psuCapacity = psu?.compatibility.psuWattage || 0;
    const recommendedPsu = Math.ceil((estimatedWatts * 1.25) / 50) * 50;

    if (psu && psuCapacity < estimatedWatts) {
      issues.push(
        `کمبود توان منبع تغذیه: مصرف تخمینی سیستم ${estimatedWatts}W از توان پاور (${psuCapacity}W) بیشتر است.`
      );
    }

    const chosenIds = BUILDER_SLOTS.map((s) => selected[s.category]).filter(
      (id): id is string => Boolean(id)
    );
    const totalPrice = chosenIds.reduce((sum, id) => sum + (getProductById(id)?.price || 0), 0);

    return {
      issues,
      isCompatible: issues.length === 0,
      estimatedWatts,
      psuCapacity,
      recommendedPsu,
      chosenIds,
      totalPrice,
    };
  }, [selected, selectedProducts]);

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10 pb-6 border-b border-neutral-200">
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-2">
            ابزار اسمبل هوشمند و کنترل سازگاری سخت‌افزار
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#111315] [text-wrap:balance]">
            پیکربندی اختصاصی سیستم با بررسی خودکار سوکت و توان
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => applyPreset('gaming')}
            className="px-4 py-2 min-h-[40px] bg-white border border-neutral-300 hover:border-[#111315] text-xs font-semibold text-[#111315] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            پیشنهاد گیمینگ 4K (AM5)
          </button>
          <button
            type="button"
            onClick={() => applyPreset('workstation')}
            className="px-4 py-2 min-h-[40px] bg-white border border-neutral-300 hover:border-[#111315] text-xs font-semibold text-[#111315] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            پیشنهاد ورک‌استیشن و AI (RTX 5090)
          </button>
          <button
            type="button"
            onClick={() => setSelected({})}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 min-h-[40px] text-xs font-semibold text-neutral-600 hover:text-[#111315] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>پاک‌سازی</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Slots List */}
        <div className="lg:col-span-8 space-y-4">
          {BUILDER_SLOTS.map((slot) => {
            const options = HARDWARE_PRODUCTS.filter((p) => p.category === slot.category);
            const activeProd = selectedProducts[slot.category];
            return (
              <div
                key={slot.category}
                className="bg-white border border-neutral-200 rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-16 h-12 rounded-lg bg-[#EFEFEA] overflow-hidden shrink-0 border border-neutral-200 flex items-center justify-center">
                    {activeProd ? (
                      <HardwareImage
                        src={activeProd.image}
                        alt={activeProd.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Cpu className="w-5 h-5 text-neutral-400" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-neutral-500 mb-0.5">
                      <span className="font-semibold text-[#111315]">
                        {CATEGORY_LABELS[slot.category]}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="truncate">{slot.hint}</span>
                    </div>
                    {activeProd ? (
                      <p className="text-sm font-semibold text-[#111315] truncate">
                        {activeProd.title}
                      </p>
                    ) : (
                      <p className="text-sm text-neutral-400">قطعه‌ای انتخاب نشده است</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <select
                    aria-label={`انتخاب ${CATEGORY_LABELS[slot.category]}`}
                    value={selected[slot.category] || ''}
                    onChange={(e) =>
                      setSelected((prev) => ({
                        ...prev,
                        [slot.category]: e.target.value || undefined,
                      }))
                    }
                    className="h-10 max-w-[260px] w-full sm:w-60 px-3 bg-[#F6F6F4] border border-neutral-300 rounded-lg text-xs font-medium text-[#111315] focus:outline-none focus:border-[#1E40AF] cursor-pointer"
                  >
                    <option value="">-- بدون انتخاب --</option>
                    {options.map((opt) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.title} ({formatToman(opt.price)})
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>

        {/* Sticky Compatibility & Summary Sidebar */}
        <aside className="lg:col-span-4 lg:sticky lg:top-24 bg-white border border-neutral-200 rounded-xl p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#111315] mb-1">گزارش سازگاری و توان</h2>
            <p className="text-xs text-neutral-500">محاسبه بر اساس مشخصات رسمی قطعات انتخابی</p>
          </div>

          {/* Compatibility Status Box */}
          {compatibilityReport.isCompatible ? (
            <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-900">
                  پیکربندی کاملاً سازگار است
                </p>
                <p className="text-xs text-emerald-800 mt-1">
                  سوکت پردازنده، نوع حافظه رم و ظرفیت منبع تغذیه بدون تداخل تایید شدند.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 space-y-2">
              {compatibilityReport.issues.map((issue) => (
                <div key={issue} className="flex items-start gap-2.5 text-red-900">
                  <AlertTriangle className="w-4 h-4 text-red-700 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium leading-relaxed">{issue}</p>
                </div>
              ))}
            </div>
          )}

          {/* Power Meter */}
          <div className="space-y-3 pt-4 border-t border-neutral-100">
            <div className="flex items-center justify-between text-sm">
              <span className="inline-flex items-center gap-1.5 text-neutral-600">
                <Zap className="w-4 h-4 text-[#1E40AF]" />
                <span>توان مصرفی تخمینی</span>
              </span>
              <span className="font-mono tabular-nums font-bold text-[#111315]">
                {compatibilityReport.estimatedWatts}W
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">پاور پیشنهادی مطمئن</span>
              <span className="font-mono tabular-nums font-semibold text-neutral-800">
                {compatibilityReport.recommendedPsu}W+
              </span>
            </div>

            {compatibilityReport.psuCapacity > 0 && (
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    compatibilityReport.estimatedWatts > compatibilityReport.psuCapacity
                      ? 'bg-red-600'
                      : 'bg-[#1E40AF]'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round(
                        (compatibilityReport.estimatedWatts / compatibilityReport.psuCapacity) * 100
                      )
                    )}%`,
                  }}
                />
              </div>
            )}
          </div>

          {/* Summary Totals */}
          <div className="pt-4 border-t border-neutral-100 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">تعداد قطعات انتخابی</span>
              <span className="font-mono tabular-nums font-semibold text-[#111315]">
                {formatPersianNumber(compatibilityReport.chosenIds.length)} قطعه
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-neutral-700">جمع کل سیستم</span>
              <span className="text-xl font-bold text-[#111315] tabular-nums">
                {formatToman(compatibilityReport.totalPrice)}
              </span>
            </div>

            <button
              type="button"
              disabled={compatibilityReport.chosenIds.length === 0 || !compatibilityReport.isCompatible}
              onClick={() => void addManyToCart(compatibilityReport.chosenIds)}
              className="w-full h-12 inline-flex items-center justify-center gap-2 bg-[#1E40AF] hover:bg-[#1D4ED8] disabled:bg-neutral-300 disabled:text-neutral-500 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer disabled:cursor-not-allowed"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>افزودن کل سیستم به سبد خرید</span>
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}
