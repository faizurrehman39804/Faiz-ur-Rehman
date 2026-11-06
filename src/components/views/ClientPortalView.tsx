import React from 'react';
import { 
  Smartphone, 
  Building2, 
  Receipt, 
  FileText, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Phone, 
  MessageSquare, 
  Download,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { InstallmentPlan, Receipt as ReceiptType, DealerSettings, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface ClientPortalViewProps {
  plan: InstallmentPlan;
  receipts: ReceiptType[];
  settings: DealerSettings;
  onOpenReceipt: (receipt: ReceiptType) => void;
  language: Language;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  plan,
  receipts,
  settings,
  onOpenReceipt,
  language,
}) => {
  const paidSum = plan.installments
    .filter(i => i.status === 'paid')
    .reduce((acc, curr) => acc + curr.amountPkr, 0);

  const totalPaid = plan.advancePkr + paidSum;
  const remaining = Math.max(0, plan.totalPricePkr - totalPaid);
  const paidPercent = Math.round((totalPaid / plan.totalPricePkr) * 100);

  const nextDue = plan.installments.find(i => i.status === 'pending' || i.status === 'overdue');

  return (
    <div className="space-y-6">
      
      {/* Top Banner explaining the value proposition to the dealer */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-6 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1 max-w-2xl">
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-300">
            <Smartphone className="w-4 h-4" />
            <span>Buyer Transparency & Overseas Investor Portal</span>
          </div>
          <h2 className="text-xl font-bold">
            What Your Property Buyer Sees on Their Phone
          </h2>
          <p className="text-xs text-blue-100/80 leading-relaxed">
            Eliminate 90% of phone calls asking "Meri kitni qistain reh gayi hain?" Give clients a secure digital khata where they track payments and download verified receipts.
          </p>
        </div>

        <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 text-center shrink-0">
          <span className="text-[10px] text-blue-200 uppercase font-semibold">Simulated Logged-in Client</span>
          <p className="text-sm font-bold text-white mt-0.5">{plan.clientName}</p>
        </div>
      </div>

      {/* Embedded Buyer Portal Preview */}
      <div className="max-w-3xl mx-auto bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md overflow-hidden text-xs">
        
        {/* Portal Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-bold flex items-center justify-center text-sm shadow-xs">
              {settings.dealerName[0]}
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                {settings.dealerName} · Investor Portal
              </h3>
              <p className="text-[11px] text-slate-500">
                Verified Investment Account of {plan.clientName}
              </p>
            </div>
          </div>

          <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Verified
          </span>
        </div>

        {/* Property Card */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 flex flex-col sm:flex-row justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400">Your Property Investment</span>
              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                {plan.propertyTitle}
              </h4>
              <p className="text-slate-500 mt-1">
                Booking Schedule ID: #{plan.id.toUpperCase()} · Deal Initiated: {plan.startDate}
              </p>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400">Total Purchase Price</span>
              <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                {formatPKR(plan.totalPricePkr, 'en')}
              </p>
            </div>
          </div>

          {/* Paid vs Remaining Progress Bar */}
          <div className="space-y-2 p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800 dark:text-slate-200">
                Payment Progress: {paidPercent}% Paid
              </span>
              <span className="font-bold text-emerald-600">
                Remaining: {formatPKR(remaining, 'en')}
              </span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
              <div
                className="bg-emerald-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${paidPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-3 text-center border-t border-slate-100 dark:border-slate-800 mt-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Total Paid to Date</span>
                <p className="font-black text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                  {formatPKR(totalPaid, 'en')}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Next Installment Due</span>
                <p className="font-black text-amber-600 text-sm mt-0.5">
                  {nextDue ? `${formatPKR(nextDue.amountPkr, 'en')} (${nextDue.dueDate})` : 'Fully Paid'}
                </p>
              </div>
            </div>
          </div>

          {/* Downloadable Receipts List */}
          <div className="space-y-3">
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-emerald-600" />
              Download Official Payment Receipts
            </h4>

            <div className="space-y-2">
              {receipts.map((rec) => (
                <div
                  key={rec.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-900 dark:text-slate-100">{rec.receiptNumber}</span>
                      <span className="text-[10px] text-slate-400">· Date: {rec.date}</span>
                    </div>
                    <p className="text-slate-500 text-[11px]">Mode: {rec.paymentMethod} (Ref: {rec.referenceNumber})</p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatPKR(rec.amountPkr, 'en')}
                    </span>
                    <button
                      type="button"
                      onClick={() => onOpenReceipt(rec)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 rounded-lg font-semibold text-xs transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Receipt
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact My Agent Section */}
          <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-700 dark:text-emerald-300">Dedicated Property Advisor</span>
              <p className="font-bold text-sm text-slate-900 dark:text-slate-100">Faiz Rehman</p>
              <p className="text-slate-500 text-[11px]">{settings.phone} · Office in {settings.area}</p>
            </div>

            <a
              href={`https://wa.me/92${settings.phone.replace(/[^0-9]/g, '').slice(-10)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-xs transition-colors"
            >
              <MessageSquare className="w-4 h-4" />
              Message Agent
            </a>
          </div>

        </div>

      </div>

    </div>
  );
};
