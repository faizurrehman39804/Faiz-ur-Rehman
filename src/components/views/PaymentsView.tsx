import React, { useState } from 'react';
import { 
  Receipt as ReceiptIcon, 
  Plus, 
  Search, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Printer, 
  Share2, 
  FileText, 
  Ban, 
  History, 
  Clock, 
  Calculator, 
  X,
  CreditCard,
  MessageSquare
} from 'lucide-react';
import { 
  InstallmentPlan, 
  Receipt, 
  AuditLogItem, 
  PaymentMethod, 
  DealerSettings, 
  Language, 
  UserRole 
} from '../../types';
import { 
  formatPKR, 
  numberToWordsPKR, 
  calculateInstallmentSchedule 
} from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface PaymentsViewProps {
  plans: InstallmentPlan[];
  receipts: Receipt[];
  auditLogs: AuditLogItem[];
  settings: DealerSettings;
  onRecordPayment: (payment: {
    clientName: string;
    propertyTitle: string;
    amountPkr: number;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    notes: string;
  }) => void;
  onVoidPayment: (receiptId: string, reason: string) => void;
  onOpenReceipt: (receipt: Receipt) => void;
  onSendReminder: (clientName: string, amount: number, dueDate: string) => void;
  currentRole: UserRole;
  language: Language;
}

export const PaymentsView: React.FC<PaymentsViewProps> = ({
  plans,
  receipts,
  auditLogs,
  settings,
  onRecordPayment,
  onVoidPayment,
  onOpenReceipt,
  onSendReminder,
  currentRole,
  language,
}) => {
  const t = translations[language];

  const [activeTab, setActiveTab] = useState<'plans' | 'receipts' | 'builder' | 'audit'>('plans');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<InstallmentPlan | null>(plans[0] || null);

  // Record payment modal
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [recordClient, setRecordClient] = useState('');
  const [recordProperty, setRecordProperty] = useState('');
  const [recordAmount, setRecordAmount] = useState('4000000');
  const [recordMethod, setRecordMethod] = useState<PaymentMethod>('Bank Transfer');
  const [recordRef, setRecordRef] = useState('HBL-TX-');
  const [recordNotes, setRecordNotes] = useState('Monthly installment payment against agreed schedule');

  // Void modal
  const [isVoidModalOpen, setIsVoidModalOpen] = useState(false);
  const [voidTargetReceipt, setVoidTargetReceipt] = useState<Receipt | null>(null);
  const [voidReason, setVoidReason] = useState('Client returned post-dated cheque');

  // Plan builder state
  const [builderTotal, setBuilderTotal] = useState(30000000);
  const [builderAdvance, setBuilderAdvance] = useState(6000000);
  const [builderCount, setBuilderCount] = useState(6);
  const [builderFreq, setBuilderFreq] = useState<'monthly' | 'quarterly'>('monthly');
  const [builderStart, setBuilderStart] = useState('2026-12-01');

  const generatedSchedule = calculateInstallmentSchedule(
    builderTotal,
    builderAdvance,
    builderCount,
    builderFreq,
    builderStart
  );

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recordClient || !recordAmount) return;
    onRecordPayment({
      clientName: recordClient,
      propertyTitle: recordProperty || 'Property Booking Installment',
      amountPkr: Number(recordAmount),
      paymentMethod: recordMethod,
      referenceNumber: recordRef,
      notes: recordNotes,
    });
    setIsRecordModalOpen(false);
  };

  const handleVoidSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!voidTargetReceipt || !voidReason) return;
    onVoidPayment(voidTargetReceipt.id, voidReason);
    setIsVoidModalOpen(false);
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <span>{t.navPayments}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold">
              Ledgers & Receipts
            </span>
          </h2>
          <p className="text-xs text-slate-500">
            Dispute-free installment schedules, verified computerized receipts, and audit trail
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('builder')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-semibold text-xs rounded-lg transition-colors"
          >
            <Calculator className="w-4 h-4 text-emerald-600" />
            <span>Installment Builder</span>
          </button>

          <button
            type="button"
            onClick={() => setIsRecordModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.recordPayment}</span>
          </button>
        </div>
      </div>

      {/* Tabs Switcher Bar */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('plans')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'plans'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CreditCard className="w-4 h-4" />
          <span>Active Installment Plans ({plans.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('receipts')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'receipts'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <ReceiptIcon className="w-4 h-4" />
          <span>Issued Receipts ({receipts.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('builder')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'builder'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <Calculator className="w-4 h-4" />
          <span>Plan Calculator</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('audit')}
          className={`py-3 px-4 border-b-2 transition-colors flex items-center gap-2 ${
            activeTab === 'audit'
              ? 'border-emerald-600 text-emerald-600 dark:text-emerald-400'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Audit Log & Void Records</span>
        </button>
      </div>

      {/* Tab 1: Installment Plans & Ledgers */}
      {activeTab === 'plans' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Plans Roster (Left column) */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase text-slate-500 tracking-wider">
              Client Deal Ledgers
            </h3>
            {plans.map((p) => {
              const isSelected = selectedPlan?.id === p.id;
              const paidSum = p.installments
                .filter(i => i.status === 'paid')
                .reduce((acc, curr) => acc + curr.amountPkr, 0);
              const hasOverdue = p.installments.some(i => i.status === 'overdue');

              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlan(p)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs space-y-2 ${
                    isSelected
                      ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {p.clientName}
                      </h4>
                      <p className="text-[11px] text-slate-500">{p.propertyTitle}</p>
                    </div>
                    {hasOverdue ? (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                        OVERDUE
                      </span>
                    ) : (
                      <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                        ON TRACK
                      </span>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Paid: {formatPKR(p.advancePkr + paidSum, language)}</span>
                      <span className="font-bold">{formatPKR(p.totalPricePkr, language)}</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-600 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.round(((p.advancePkr + paidSum) / p.totalPricePkr) * 100))}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Active Ledger Schedule Details (Right column 2-span) */}
          {selectedPlan && (
            <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 gap-2">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                    {selectedPlan.clientName} · Installment Schedule
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedPlan.propertyTitle} · Frequency: {selectedPlan.frequency}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Total Price</span>
                  <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(selectedPlan.totalPricePkr, language)}
                  </p>
                </div>
              </div>

              {/* Advance Paid Callout */}
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 dark:text-emerald-200">Token & Advance Downpayment</span>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-400">Cleared upon deal agreement signing</p>
                </div>
                <span className="text-sm font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
                  {formatPKR(selectedPlan.advancePkr, language)}
                </span>
              </div>

              {/* Schedule Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5">#</th>
                      <th className="p-2.5">Due Date</th>
                      <th className="p-2.5">Amount</th>
                      <th className="p-2.5">Status</th>
                      <th className="p-2.5">Payment Details</th>
                      <th className="p-2.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedPlan.installments.map((inst) => (
                      <tr
                        key={inst.installmentNumber}
                        className={inst.status === 'overdue' ? 'bg-rose-50/40 dark:bg-rose-950/20' : ''}
                      >
                        <td className="p-2.5 font-bold font-mono">Inst #{inst.installmentNumber}</td>
                        <td className="p-2.5 font-mono">{inst.dueDate}</td>
                        <td className="p-2.5 font-bold tabular-nums">{formatPKR(inst.amountPkr, language)}</td>
                        <td className="p-2.5">
                          {inst.status === 'paid' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                              PAID
                            </span>
                          )}
                          {inst.status === 'overdue' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                              OVERDUE
                            </span>
                          )}
                          {inst.status === 'pending' && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 dark:bg-slate-800">
                              Upcoming
                            </span>
                          )}
                        </td>
                        <td className="p-2.5 text-slate-500">
                          {inst.status === 'paid' ? (
                            <span>{inst.paymentMethod} · {inst.receiptNumber}</span>
                          ) : (
                            <span className="italic text-slate-400">Awaiting clearance</span>
                          )}
                        </td>
                        <td className="p-2.5 text-right">
                          {inst.status === 'overdue' && (
                            <button
                              type="button"
                              onClick={() => onSendReminder(selectedPlan.clientName, inst.amountPkr, inst.dueDate)}
                              className="px-2 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 ml-auto"
                            >
                              <MessageSquare className="w-3 h-3" />
                              WhatsApp
                            </button>
                          )}
                          {inst.status === 'paid' && inst.receiptNumber && (
                            <button
                              type="button"
                              onClick={() => {
                                const rc = receipts.find(r => r.receiptNumber === inst.receiptNumber) || {
                                  id: `rec-${inst.receiptNumber || '000'}`,
                                  receiptNumber: inst.receiptNumber || 'REC-2026-000',
                                  date: inst.paidDate || '2026-10-14',
                                  clientName: selectedPlan.clientName,
                                  clientCnic: '17301-4729184-1',
                                  propertyTitle: selectedPlan.propertyTitle,
                                  amountPkr: inst.amountPkr,
                                  amountInWords: numberToWordsPKR(inst.amountPkr),
                                  paymentMethod: inst.paymentMethod || 'Bank Transfer',
                                  referenceNumber: 'HBL-FT-948172635',
                                  receivedBy: 'Faiz Rehman',
                                  notes: 'Cleared on desk',
                                };
                                onOpenReceipt(rc);
                              }}
                              className="text-xs text-emerald-600 hover:underline font-semibold"
                            >
                              View Receipt
                            </button>
                          )}
                          {inst.status === 'pending' && (
                            <button
                              type="button"
                              onClick={() => {
                                setRecordClient(selectedPlan.clientName);
                                setRecordProperty(selectedPlan.propertyTitle);
                                setRecordAmount(String(inst.amountPkr));
                                setIsRecordModalOpen(true);
                              }}
                              className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold"
                            >
                              Receive Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      )}

      {/* Tab 2: Issued Receipts */}
      {activeTab === 'receipts' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Computerized Official Receipts Archive
            </h3>
            <span className="text-xs text-slate-500">
              All payments generate verifiable receipts with dealer stamp and signatures
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="p-3">Receipt No</th>
                  <th className="p-3">Date</th>
                  <th className="p-3">Client</th>
                  <th className="p-3">Property</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Payment Mode</th>
                  <th className="p-3">Received By</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {receipts.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">
                      {rec.receiptNumber}
                    </td>
                    <td className="p-3 font-mono">{rec.date}</td>
                    <td className="p-3 font-semibold">{rec.clientName}</td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{rec.propertyTitle}</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatPKR(rec.amountPkr, language)}
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                        {rec.paymentMethod}
                      </span>
                    </td>
                    <td className="p-3 text-slate-500">{rec.receivedBy}</td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onOpenReceipt(rec)}
                          className="px-2.5 py-1 text-xs text-emerald-600 hover:bg-emerald-50 rounded font-semibold"
                        >
                          Print / View
                        </button>
                        {currentRole === 'owner' && (
                          <button
                            type="button"
                            onClick={() => {
                              setVoidTargetReceipt(rec);
                              setIsVoidModalOpen(true);
                            }}
                            className="text-xs text-rose-500 hover:text-rose-700 font-medium"
                          >
                            Void
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Interactive Installment Schedule Builder */}
      {activeTab === 'builder' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          
          <div className="border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
              Interactive Installment Schedule Calculator
            </h3>
            <p className="text-xs text-slate-500">
              Generate custom payment plans during buyer negotiations in 5 seconds
            </p>
          </div>

          {/* Builder Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Total Price (PKR)</label>
              <input
                type="number"
                step="500000"
                value={builderTotal}
                onChange={(e) => setBuilderTotal(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                {formatPKR(builderTotal, language)}
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Advance Downpayment</label>
              <input
                type="number"
                step="100000"
                value={builderAdvance}
                onChange={(e) => setBuilderAdvance(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
              <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                {formatPKR(builderAdvance, language)}
              </span>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Number of Installments</label>
              <input
                type="number"
                min="1"
                max="36"
                value={builderCount}
                onChange={(e) => setBuilderCount(Number(e.target.value))}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Frequency</label>
              <select
                value={builderFreq}
                onChange={(e) => setBuilderFreq(e.target.value as any)}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly (3 Months)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Schedule Start Date</label>
              <input
                type="date"
                value={builderStart}
                onChange={(e) => setBuilderStart(e.target.value)}
                className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          {/* Generated Result Preview */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Generated Schedule Breakdown
                </h4>
                <p className="text-xs text-slate-500">
                  Remaining {formatPKR(builderTotal - builderAdvance, language)} divided into {builderCount} equal {builderFreq} installments
                </p>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Each Installment</span>
                <p className="text-lg font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatPKR(Math.round((builderTotal - builderAdvance) / builderCount), language)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
              {generatedSchedule.map((item) => (
                <div key={item.installmentNumber} className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-center">
                  <span className="text-[10px] font-bold text-slate-400">Inst #{item.installmentNumber}</span>
                  <p className="font-bold text-xs mt-0.5">{formatPKR(item.amountPkr, language)}</p>
                  <p className="text-[10px] font-mono text-slate-500 mt-0.5">{item.dueDate}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* Tab 4: Audit Log & Non-Deletable Void Flow */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs p-5 space-y-4">
          <div>
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              System Audit Trail & Security Ledger
            </h3>
            <p className="text-xs text-slate-500">
              Financial Integrity Guarantee: In PropDesk, payments can never be erased, only voided with recorded reason.
            </p>
          </div>

          <div className="space-y-3">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className={`p-3 rounded-lg border text-xs flex items-start justify-between gap-3 ${
                  log.isVoided
                    ? 'bg-rose-50/50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-900/60'
                    : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{log.action}</span>
                    <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
                    {log.isVoided && (
                      <span className="text-[9px] px-1.5 py-0.2 bg-rose-600 text-white font-bold rounded">
                        VOIDED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300">{log.details}</p>
                  {log.voidReason && (
                    <p className="text-[11px] text-rose-600 font-medium">Reason: {log.voidReason}</p>
                  )}
                </div>

                <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                  {log.user}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {isRecordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Record Payment & Issue Receipt
              </h3>
              <button
                type="button"
                onClick={() => setIsRecordModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRecordSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Client Name</label>
                <input
                  type="text"
                  required
                  value={recordClient}
                  onChange={(e) => setRecordClient(e.target.value)}
                  placeholder="e.g. Dr. Asadullah Durrani"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Property Description</label>
                <input
                  type="text"
                  value={recordProperty}
                  onChange={(e) => setRecordProperty(e.target.value)}
                  placeholder="e.g. 10 Marla House Phase 4"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Amount (PKR)</label>
                  <input
                    type="number"
                    step="50000"
                    required
                    value={recordAmount}
                    onChange={(e) => setRecordAmount(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                  <span className="text-[10px] text-emerald-600 font-semibold mt-0.5 block">
                    {formatPKR(Number(recordAmount), language)}
                  </span>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Payment Mode</label>
                  <select
                    value={recordMethod}
                    onChange={(e) => setRecordMethod(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer (HBL / MCB / Meezan)</option>
                    <option value="Cheque">Crossed Cheque / Pay Order</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Reference / Cheque Number</label>
                <input
                  type="text"
                  value={recordRef}
                  onChange={(e) => setRecordRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsRecordModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Save & Print Official Receipt
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Void Payment Modal with Reason */}
      {isVoidModalOpen && voidTargetReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-rose-600 flex items-center gap-1.5">
                <Ban className="w-4 h-4" />
                Void Receipt #{voidTargetReceipt.receiptNumber}
              </h3>
              <button
                type="button"
                onClick={() => setIsVoidModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleVoidSubmit} className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-400">
                Receipts in PropDesk cannot be deleted to maintain compliance and prevent fraud. Voiding will record a permanent note in the audit log.
              </p>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Reason for Voiding</label>
                <textarea
                  required
                  rows={3}
                  value={voidReason}
                  onChange={(e) => setVoidReason(e.target.value)}
                  placeholder="e.g. Bank cheque dishonored / incorrect ledger entry"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsVoidModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg"
                >
                  Confirm Void Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
