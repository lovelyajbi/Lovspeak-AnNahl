import React, { ReactNode } from 'react';

type Tone = 'primary' | 'success' | 'warning' | 'danger' | 'neutral';

const toneStyles: Record<Tone, { icon: string; soft: string; text: string; border: string }> = {
  primary: { icon: 'bg-lovelya-600 text-white shadow-lovelya-200/70 dark:shadow-none', soft: 'bg-lovelya-50 dark:bg-lovelya-900/20', text: 'text-lovelya-700 dark:text-lovelya-300', border: 'border-lovelya-100 dark:border-lovelya-800/60' },
  success: { icon: 'bg-emerald-600 text-white shadow-emerald-200/70 dark:shadow-none', soft: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-100 dark:border-emerald-800/60' },
  warning: { icon: 'bg-amber-500 text-white shadow-amber-200/70 dark:shadow-none', soft: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', border: 'border-amber-100 dark:border-amber-800/60' },
  danger: { icon: 'bg-rose-500 text-white shadow-rose-200/70 dark:shadow-none', soft: 'bg-rose-50 dark:bg-rose-900/20', text: 'text-rose-700 dark:text-rose-300', border: 'border-rose-100 dark:border-rose-800/60' },
  neutral: { icon: 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-gray-200/70 dark:shadow-none', soft: 'bg-gray-50 dark:bg-gray-800/70', text: 'text-gray-700 dark:text-gray-200', border: 'border-gray-100 dark:border-gray-700' },
};

export const ResultCard: React.FC<{ children: ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`relative overflow-hidden rounded-[1.5rem] md:rounded-[2rem] border border-gray-100 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-[0_18px_55px_-34px_rgba(15,23,42,0.5)] ${className}`}>
    <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-lovelya-300/70 to-transparent" />
    {children}
  </div>
);

export const ResultHeader: React.FC<{ icon: string; eyebrow?: string; title: string; description?: string; tone?: Tone; aside?: ReactNode }> = ({ icon, eyebrow = 'Hasil latihan', title, description, tone = 'primary', aside }) => {
  const style = toneStyles[tone];
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-start gap-3 md:gap-4">
        <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl md:rounded-2xl text-sm md:text-base shadow-lg ${style.icon}`}><i className={`fas ${icon}`} /></div>
        <div className="min-w-0">
          <p className={`mb-1 text-[9px] md:text-[10px] font-black uppercase tracking-[0.18em] ${style.text}`}>{eyebrow}</p>
          <h2 className="text-lg md:text-2xl font-black leading-tight text-gray-900 dark:text-white">{title}</h2>
          {description && <p className="mt-1 max-w-2xl text-xs md:text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</p>}
        </div>
      </div>
      {aside}
    </div>
  );
};

export const ResultScore: React.FC<{ score: number | string; suffix?: string; label: string; caption?: string; tone?: Tone; icon?: string }> = ({ score, suffix = '', label, caption, tone = 'primary', icon }) => {
  const style = toneStyles[tone];
  return (
    <div className={`rounded-2xl border p-4 md:p-5 ${style.soft} ${style.border}`}>
      <div className="flex items-center justify-between gap-3"><div>
        <div className={`flex items-baseline gap-0.5 text-4xl md:text-5xl font-black tracking-tight ${style.text}`}><span>{score}</span><span className="text-xl md:text-2xl">{suffix}</span></div>
        <p className="mt-1 text-[9px] md:text-[10px] font-black uppercase tracking-[0.16em] text-gray-500 dark:text-gray-400">{label}</p>
        {caption && <p className="mt-1.5 text-xs leading-relaxed text-gray-500 dark:text-gray-400">{caption}</p>}
      </div>{icon && <div className={`flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-xl text-base ${style.icon}`}><i className={`fas ${icon}`} /></div>}</div>
    </div>
  );
};

export const ResultMetric: React.FC<{ label: string; value: ReactNode; tone?: Tone; icon?: string }> = ({ label, value, tone = 'neutral', icon }) => {
  const style = toneStyles[tone];
  return <div className={`min-w-0 rounded-xl border px-3 py-2.5 md:px-4 md:py-3 ${style.soft} ${style.border}`}><div className="flex items-center gap-2">{icon && <i className={`fas ${icon} text-[10px] ${style.text}`} />}<span className="truncate text-[8px] md:text-[9px] font-black uppercase tracking-[0.14em] text-gray-400">{label}</span></div><div className={`mt-1 text-sm md:text-base font-black ${style.text}`}>{value}</div></div>;
};

export const ResultSection: React.FC<{ title: string; children: ReactNode; icon?: string; tone?: Tone; className?: string }> = ({ title, children, icon, tone = 'neutral', className = '' }) => {
  const style = toneStyles[tone];
  return <section className={`rounded-2xl border p-4 md:p-5 ${style.soft} ${style.border} ${className}`}><div className="mb-2.5 flex items-center gap-2">{icon && <i className={`fas ${icon} text-xs ${style.text}`} />}<h3 className={`text-[9px] md:text-[10px] font-black uppercase tracking-[0.16em] ${style.text}`}>{title}</h3></div>{children}</section>;
};

export const ResultChip: React.FC<{ children: ReactNode; tone?: Tone; icon?: string }> = ({ children, tone = 'neutral', icon }) => {
  const style = toneStyles[tone];
  return <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[9px] md:text-[10px] font-black ${style.soft} ${style.border} ${style.text}`}>{icon && <i className={`fas ${icon}`} />}{children}</span>;
};

export const ResultActions: React.FC<{ children: ReactNode }> = ({ children }) => <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 [&>*:only-child]:sm:col-span-2">{children}</div>;

export const resultButtonClass = {
  primary: 'w-full min-h-12 px-5 py-3 rounded-xl md:rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-xs md:text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl active:translate-y-0 transition-all',
  accent: 'w-full min-h-12 px-5 py-3 rounded-xl md:rounded-2xl bg-lovelya-600 hover:bg-lovelya-700 text-white font-black text-xs md:text-sm shadow-lg shadow-lovelya-200/60 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all',
  success: 'w-full min-h-12 px-5 py-3 rounded-xl md:rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm shadow-lg shadow-emerald-200/60 dark:shadow-none hover:-translate-y-0.5 active:translate-y-0 transition-all',
  secondary: 'w-full min-h-12 px-5 py-3 rounded-xl md:rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-black text-xs md:text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-all',
};
