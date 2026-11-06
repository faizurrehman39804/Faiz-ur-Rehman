import React, { useState } from 'react';
import { Sparkles, ArrowRight, Check, X, Shield, MessageSquare, Receipt, Globe } from 'lucide-react';
import { Language } from '../types';

interface OnboardingTourProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const OnboardingTour: React.FC<OnboardingTourProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [step, setStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      title: 'Welcome to PropDesk (Peshawar MVP)',
      subtitle: 'Built specifically for property dealers in Peshawar, KP',
      description: 'Run your entire dealership from one unified screen: inventory in Hayatabad, Regi Model Town, and DHA, client ledgers, and agent activities without register headaches.',
      icon: Shield,
      tag: 'Owner Overview',
    },
    {
      title: 'WhatsApp Lead CRM in 5 Seconds',
      subtitle: 'Never lose another client inquiry from WhatsApp or walk-in',
      description: 'Drag-and-drop Kanban pipeline from New Inquiry to Closed Won. Send prefilled WhatsApp messages and match inventory to buyer requirements automatically.',
      icon: MessageSquare,
      tag: 'Leads & Sales',
    },
    {
      title: 'Dispute-Free Installments & Instant Receipts',
      subtitle: 'Zero khata disagreements with buyers and sellers',
      description: 'Build automated installment schedules in 10 seconds. Issue computerized receipts with amount in words, download PDFs, and send instant WhatsApp reminders for overdue dues.',
      icon: Receipt,
      tag: 'Financials & Trust',
    },
    {
      title: 'Your Branded Website & Client Portal',
      subtitle: 'A premium digital identity for your real estate agency',
      description: 'Your dealer name, logo, and active listings showcased on a public website. Plus, give buyers a dedicated portal where they can check payment progress and download receipts.',
      icon: Globe,
      tag: 'Brand & Growth',
    },
  ];

  const current = steps[step];
  const Icon = current.icon;

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top bar with dots */}
        <div className="p-4 border-b border-slate-100 dark:border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === step ? 'w-6 bg-emerald-600' : 'w-2 bg-slate-200 dark:bg-slate-700'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            Skip Tour
          </button>
        </div>

        {/* Visual Body */}
        <div className="p-6 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shadow-xs">
            <Icon className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              {current.tag} · Step {step + 1} of 4
            </span>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              {current.title}
            </h3>
            <p className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              {current.subtitle}
            </p>
          </div>

          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed px-2">
            {current.description}
          </p>
        </div>

        {/* Action button */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 disabled:opacity-30 disabled:pointer-events-none"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleNext}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
          >
            <span>{step === steps.length - 1 ? 'Start Interactive Demo' : 'Next Step'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
