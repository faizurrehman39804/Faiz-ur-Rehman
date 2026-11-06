import React from 'react';
import { X, Printer, Share2, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Receipt, DealerSettings, Language } from '../types';
import { formatPKR } from '../utils/formatters';

interface ReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  receipt: Receipt | null;
  settings: DealerSettings;
  language: Language;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  isOpen,
  onClose,
  receipt,
  settings,
  language,
}) => {
  if (!isOpen || !receipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `*OFFICIAL PAYMENT RECEIPT*\n` +
      `*${settings.dealerName.toUpperCase()}*\n` +
      `--------------------------------\n` +
      `Receipt No: ${receipt.receiptNumber}\n` +
      `Date: ${receipt.date}\n` +
      `Client: ${receipt.clientName}\n` +
      `Property: ${receipt.propertyTitle}\n` +
      `Amount Received: ${formatPKR(receipt.amountPkr, 'en')}\n` +
      `Words: ${receipt.amountInWords}\n` +
      `Payment Mode: ${receipt.paymentMethod} (Ref: ${receipt.referenceNumber})\n` +
      `Received By: ${receipt.receivedBy}\n` +
      `--------------------------------\n` +
      `Verified & Recorded on PropDesk System.`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[95vh]">
        
        {/* Modal Top Actions */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40 no-print">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
              Verified Receipt
            </span>
            <span className="text-xs font-mono text-slate-500">
              {receipt.receiptNumber}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp Share
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 text-xs font-medium rounded-lg transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print Receipt
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Receipt Paper Sheet */}
        <div className="p-8 overflow-y-auto bg-white text-slate-900 select-text">
          <div className="border-2 border-slate-900 p-6 rounded-lg relative">
            
            {/* Watermark stamp */}
            <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none select-none">
              <span className="text-8xl font-black rotate-[-25deg] tracking-widest uppercase">
                PAID
              </span>
            </div>

            {/* Letterhead */}
            <div className="border-b-2 border-slate-900 pb-4 mb-5 flex items-start justify-between">
              <div>
                <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                  {settings.dealerName}
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  {settings.tagline}
                </p>
                <p className="text-[11px] text-slate-500 mt-1">
                  {settings.address} · Phone: {settings.phone}
                </p>
              </div>

              <div className="text-right">
                <span className="inline-block px-3 py-1 bg-slate-900 text-white font-black text-xs uppercase tracking-wider rounded">
                  Official Receipt
                </span>
                <p className="text-xs font-mono font-bold mt-2 text-slate-900">
                  No: {receipt.receiptNumber}
                </p>
                <p className="text-xs text-slate-600">
                  Date: {receipt.date}
                </p>
              </div>
            </div>

            {/* Receipt Details Table */}
            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Received With Thanks From</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{receipt.clientName}</p>
                  <p className="text-[11px] text-slate-600">CNIC: {receipt.clientCnic}</p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Against Property / Project</span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">{receipt.propertyTitle}</p>
                  <p className="text-[11px] text-slate-600">Payment Mode: {receipt.paymentMethod} (Ref: {receipt.referenceNumber})</p>
                </div>
              </div>

              {/* Amount Box */}
              <div className="bg-slate-50 p-4 rounded-md border border-slate-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Amount In Words</span>
                  <p className="text-xs font-semibold text-slate-900 italic mt-0.5">
                    {receipt.amountInWords}
                  </p>
                </div>
                <div className="text-right shrink-0 pl-4 border-l border-slate-300">
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Amount Received</span>
                  <p className="text-xl font-black text-emerald-800 tabular-nums">
                    {formatPKR(receipt.amountPkr, 'en')}
                  </p>
                </div>
              </div>

              {/* Notes */}
              {receipt.notes && (
                <div className="pt-2 text-[11px] text-slate-600">
                  <span className="font-semibold text-slate-700">Remarks: </span>
                  {receipt.notes}
                </div>
              )}

              {/* Signatures & Seal */}
              <div className="pt-12 grid grid-cols-2 gap-8 items-end">
                <div className="text-center">
                  <div className="border-t border-slate-400 w-44 mx-auto pt-1 text-[11px] text-slate-600">
                    Client Signature / Thumb
                  </div>
                </div>
                <div className="text-center">
                  <div className="border-t border-slate-400 w-48 mx-auto pt-1 text-[11px] text-slate-900 font-semibold">
                    Authorized Signatory / Stamp
                    <p className="text-[10px] text-slate-500 font-normal mt-0.5">
                      {receipt.receivedBy}
                    </p>
                  </div>
                </div>
              </div>

              {/* Fineprint */}
              <div className="pt-4 text-center border-t border-slate-200 text-[10px] text-slate-400">
                This is a computerized receipt issued via PropDesk Real Estate Management System. Subject to cheque realization.
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
