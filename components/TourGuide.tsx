import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

export interface TourStep {
  target?: string;
  title: string;
  description: string;
  mobileDescription?: string;
}

interface TourGuideProps {
  open: boolean;
  steps: TourStep[];
  onClose: (completed: boolean) => void;
  onStepChange?: (stepIndex: number) => void;
}

type Placement = 'top' | 'bottom' | 'left' | 'right';

interface TooltipPosition {
  top: number;
  left: number;
  placement: Placement;
  arrowOffset: number;
}

const VIEWPORT_GAP = 12;
const TARGET_GAP = 14;
const SPOTLIGHT_PADDING = 6;

const findVisibleTarget = (selector: string) => {
  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return elements.find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0
      && rect.height > 0
      && rect.right > 0
      && rect.bottom > 0
      && rect.left < window.innerWidth
      && rect.top < window.innerHeight
      && style.display !== 'none'
      && style.visibility !== 'hidden';
  }) || null;
};

const findRenderedTarget = (selector: string) => {
  const visibleTarget = findVisibleTarget(selector);
  if (visibleTarget) return visibleTarget;

  const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
  return elements.find((element) => {
    const rect = element.getBoundingClientRect();
    const style = window.getComputedStyle(element);
    return rect.width > 0
      && rect.height > 0
      && style.display !== 'none'
      && style.visibility !== 'hidden';
  }) || null;
};

const TourGuide: React.FC<TourGuideProps> = ({ open, steps, onClose, onStepChange }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [position, setPosition] = useState<TooltipPosition | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const activeStep = steps[stepIndex];

  const updateLayout = useCallback(() => {
    if (!open || !activeStep) return;
    const tooltip = tooltipRef.current;
    if (!tooltip) return;

    if (!activeStep.target) {
      const tooltipWidth = tooltip.offsetWidth;
      const tooltipHeight = tooltip.offsetHeight;
      setTargetRect(null);
      setPosition({
        top: Math.max(VIEWPORT_GAP, (window.innerHeight - tooltipHeight) / 2),
        left: Math.max(VIEWPORT_GAP, (window.innerWidth - tooltipWidth) / 2),
        placement: 'bottom',
        arrowOffset: 0,
      });
      return;
    }

    const target = findVisibleTarget(activeStep.target);
    if (!target) {
      setTargetRect(null);
      return;
    }

    const rect = target.getBoundingClientRect();
    setTargetRect(rect);

    const tooltipWidth = tooltip.offsetWidth;
    const tooltipHeight = tooltip.offsetHeight;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const space = {
      top: rect.top,
      bottom: viewportHeight - rect.bottom,
      left: rect.left,
      right: viewportWidth - rect.right,
    };

    let placement: Placement;
    if (space.bottom >= tooltipHeight + TARGET_GAP) placement = 'bottom';
    else if (space.top >= tooltipHeight + TARGET_GAP) placement = 'top';
    else if (space.right >= tooltipWidth + TARGET_GAP) placement = 'right';
    else if (space.left >= tooltipWidth + TARGET_GAP) placement = 'left';
    else placement = space.bottom >= space.top ? 'bottom' : 'top';

    let top = 0;
    let left = 0;
    if (placement === 'bottom' || placement === 'top') {
      top = placement === 'bottom' ? rect.bottom + TARGET_GAP : rect.top - tooltipHeight - TARGET_GAP;
      left = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = Math.max(VIEWPORT_GAP, Math.min(left, viewportWidth - tooltipWidth - VIEWPORT_GAP));
      top = Math.max(VIEWPORT_GAP, Math.min(top, viewportHeight - tooltipHeight - VIEWPORT_GAP));
      const arrowOffset = Math.max(22, Math.min(rect.left + rect.width / 2 - left, tooltipWidth - 22));
      setPosition({ top, left, placement, arrowOffset });
    } else {
      left = placement === 'right' ? rect.right + TARGET_GAP : rect.left - tooltipWidth - TARGET_GAP;
      top = rect.top + rect.height / 2 - tooltipHeight / 2;
      left = Math.max(VIEWPORT_GAP, Math.min(left, viewportWidth - tooltipWidth - VIEWPORT_GAP));
      top = Math.max(VIEWPORT_GAP, Math.min(top, viewportHeight - tooltipHeight - VIEWPORT_GAP));
      const arrowOffset = Math.max(22, Math.min(rect.top + rect.height / 2 - top, tooltipHeight - 22));
      setPosition({ top, left, placement, arrowOffset });
    }
  }, [activeStep, open]);

  useEffect(() => {
    if (!open) return;
    setStepIndex(0);
  }, [open]);

  useLayoutEffect(() => {
    if (!open || !activeStep) return;
    onStepChange?.(stepIndex);
    const firstScrollTimer = window.setTimeout(() => {
      const target = activeStep.target ? findRenderedTarget(activeStep.target) : null;
      target?.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
    }, 120);
    const confirmScrollTimer = window.setTimeout(() => {
      const target = activeStep.target ? findRenderedTarget(activeStep.target) : null;
      target?.scrollIntoView({ behavior: 'auto', block: 'center', inline: 'nearest' });
    }, 420);
    const layoutTimer = window.setTimeout(updateLayout, 520);
    return () => {
      window.clearTimeout(firstScrollTimer);
      window.clearTimeout(confirmScrollTimer);
      window.clearTimeout(layoutTimer);
    };
  }, [activeStep, onStepChange, open, stepIndex, updateLayout]);

  useEffect(() => {
    if (!open) return;
    const handleUpdate = () => window.requestAnimationFrame(updateLayout);
    window.addEventListener('resize', handleUpdate);
    window.addEventListener('scroll', handleUpdate, true);
    const observer = new ResizeObserver(handleUpdate);
    const mutationObserver = new MutationObserver(handleUpdate);
    if (tooltipRef.current) observer.observe(tooltipRef.current);
    mutationObserver.observe(document.body, { childList: true, subtree: true });
    return () => {
      window.removeEventListener('resize', handleUpdate);
      window.removeEventListener('scroll', handleUpdate, true);
      observer.disconnect();
      mutationObserver.disconnect();
    };
  }, [open, updateLayout]);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose(false);
      if (event.key === 'ArrowRight' && stepIndex < steps.length - 1) setStepIndex((index) => index + 1);
      if (event.key === 'ArrowLeft' && stepIndex > 0) setStepIndex((index) => index - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open, stepIndex, steps.length]);

  if (!open || !activeStep) return null;

  const spotlight = targetRect ? {
    top: Math.max(4, targetRect.top - SPOTLIGHT_PADDING),
    left: Math.max(4, targetRect.left - SPOTLIGHT_PADDING),
    width: Math.min(window.innerWidth - 8, targetRect.width + SPOTLIGHT_PADDING * 2),
    height: Math.min(window.innerHeight - 8, targetRect.height + SPOTLIGHT_PADDING * 2),
  } : null;

  return createPortal(
    <div className="fixed inset-0 z-[200]" role="presentation">
      {spotlight ? (
        <div
          className="fixed rounded-2xl pointer-events-none transition-all duration-300 ease-out ring-2 ring-white"
          style={{
            ...spotlight,
            boxShadow: '0 0 0 9999px rgba(8, 15, 28, 0.72), 0 0 0 5px rgba(236, 72, 153, 0.75)',
          }}
        />
      ) : (
        <div className="fixed inset-0 bg-slate-950/75" />
      )}

      <div className="fixed inset-0" onClick={() => onClose(false)} aria-hidden="true" />

      <div
        ref={tooltipRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-title"
        aria-describedby="tour-description"
        className={`fixed w-[calc(100vw-24px)] max-w-[360px] rounded-3xl bg-white dark:bg-gray-900 p-5 shadow-2xl border border-gray-100 dark:border-gray-700 transition-opacity duration-200 ${position ? 'opacity-100' : 'opacity-0'}`}
        style={position ? { top: position.top, left: position.left } : { top: VIEWPORT_GAP, left: VIEWPORT_GAP }}
        onClick={(event) => event.stopPropagation()}
      >
        {position && targetRect && (
          <span
            className="absolute w-3 h-3 bg-white dark:bg-gray-900 rotate-45"
            style={position.placement === 'bottom' ? { top: -6, left: position.arrowOffset - 6 }
              : position.placement === 'top' ? { bottom: -6, left: position.arrowOffset - 6 }
                : position.placement === 'right' ? { left: -6, top: position.arrowOffset - 6 }
                  : { right: -6, top: position.arrowOffset - 6 }}
          />
        )}

        <div className="relative">
          <div className="flex items-center justify-between gap-3 mb-3">
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-lovelya-600 dark:text-lovelya-400">
              Panduan {stepIndex + 1} dari {steps.length}
            </span>
            <button
              type="button"
              onClick={() => onClose(false)}
              className="text-xs font-bold text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-1 py-1"
            >
              Lewati
            </button>
          </div>

          <h2 id="tour-title" className="text-lg font-black text-gray-900 dark:text-white leading-tight mb-2">
            {activeStep.title}
          </h2>
          <p id="tour-description" className="text-[13px] sm:text-sm text-gray-500 dark:text-gray-300 leading-relaxed">
            {window.innerWidth < 640 && activeStep.mobileDescription
              ? activeStep.mobileDescription
              : activeStep.description}
          </p>

          <div className="flex items-center justify-between gap-4 mt-5">
            <div className="flex gap-1.5" aria-hidden="true">
              {steps.map((_, index) => (
                <span key={index} className={`h-1.5 rounded-full transition-all ${index === stepIndex ? 'w-6 bg-lovelya-500' : 'w-1.5 bg-gray-200 dark:bg-gray-700'}`} />
              ))}
            </div>
            <div className="flex gap-2">
              {stepIndex > 0 && (
                <button
                  type="button"
                  onClick={() => setStepIndex((index) => index - 1)}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-black text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                >
                  Kembali
                </button>
              )}
              <button
                type="button"
                onClick={() => stepIndex === steps.length - 1 ? onClose(true) : setStepIndex((index) => index + 1)}
                className="px-4 py-2.5 rounded-xl text-xs font-black text-white bg-lovelya-600 hover:bg-lovelya-700 shadow-lg shadow-lovelya-500/20"
              >
                {stepIndex === steps.length - 1 ? 'Mulai Belajar' : 'Lanjut'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default TourGuide;
