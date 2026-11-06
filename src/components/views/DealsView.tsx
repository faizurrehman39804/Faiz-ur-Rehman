import React, { useState } from 'react';
import { 
  Handshake, 
  Plus, 
  Search, 
  CheckCircle, 
  Clock, 
  AlertTriangle, 
  FileCheck, 
  ChevronRight, 
  X,
  Building2,
  DollarSign
} from 'lucide-react';
import { Deal, DealStage, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface DealsViewProps {
  deals: Deal[];
  onUpdateDealStage: (dealId: string, newStage: DealStage) => void;
  language: Language;
}

export const DealsView: React.FC<DealsViewProps> = ({
  deals,
  onUpdateDealStage,
  language,
}) => {
  const t = translations[language];

  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);
  const [viewMode, setViewMode] = useState<'pipeline' | 'table'>('pipeline');

  const stages: { stage: DealStage; label: string; desc: string }[] = [
    { stage: 'token', label: '1. Token Advance', desc: 'Bayana paid & locked' },
    { stage: 'agreement', label: '2. Sale Agreement', desc: 'Stamp paper executed' },
    { stage: 'payments', label: '3. Payments & Ledgers', desc: 'Installments ongoing' },
    { stage: 'transfer', label: '4. Registry / Transfer', desc: 'PDA / Sub-registrar' },
    { stage: 'closed', label: '5. Closed & Handed Over', desc: 'Keys & fard delivered' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.navDeals}
          </h2>
          <p className="text-xs text-slate-500">
            Live Peshawar property transactions, token bayana tracking, and commission splits
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('pipeline')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'pipeline' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
            }`}
          >
            Pipeline Stepper
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors ${
              viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
            }`}
          >
            Table View
          </button>
        </div>
      </div>

      {/* Pipeline View */}
      {viewMode === 'pipeline' ? (
        <div className="space-y-4">
          {deals.map((deal) => {
            const currentStageIndex = stages.findIndex(s => s.stage === deal.stage);
            return (
              <div
                key={deal.id}
                onClick={() => setSelectedDeal(deal)}
                className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/60 transition-all cursor-pointer shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {deal.dealNumber} · Deal Date: {deal.date}
                    </span>
                    <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                      {deal.propertyTitle}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Buyer: <strong className="text-slate-700 dark:text-slate-300">{deal.buyerName}</strong> · Seller: <strong className="text-slate-700 dark:text-slate-300">{deal.sellerName}</strong>
                    </p>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Agreed Price</span>
                    <p className="text-base font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatPKR(deal.agreedPricePkr, language)}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      Token Paid: {formatPKR(deal.tokenPkr, language)}
                    </p>
                  </div>
                </div>

                {/* 5-Step Stepper Progress Bar */}
                <div className="space-y-2">
                  <div className="grid grid-cols-5 gap-2 text-center text-[10px]">
                    {stages.map((st, idx) => {
                      const isPast = idx < currentStageIndex;
                      const isCurrent = idx === currentStageIndex;
                      return (
                        <div key={st.stage} className="space-y-1">
                          <span className={`font-bold block truncate ${
                            isCurrent ? 'text-emerald-600 font-extrabold' : isPast ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400'
                          }`}>
                            {st.label}
                          </span>
                          <div
                            className={`h-1.5 rounded-full transition-all ${
                              isCurrent ? 'bg-emerald-600' : isPast ? 'bg-emerald-400' : 'bg-slate-200 dark:bg-slate-700'
                            }`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                  <span>Assigned Agent: <strong className="text-slate-700 dark:text-slate-300">{deal.agentName}</strong></span>
                  <span className="font-semibold text-emerald-600 hover:underline">
                    View Details & Commission Split →
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Deal ID</th>
                <th className="p-3">Property</th>
                <th className="p-3">Buyer & Seller</th>
                <th className="p-3">Agreed Price</th>
                <th className="p-3">Stage</th>
                <th className="p-3">Agent Commission</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deals.map((d) => (
                <tr key={d.id} onClick={() => setSelectedDeal(d)} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer">
                  <td className="p-3 font-mono font-bold">{d.dealNumber}</td>
                  <td className="p-3 font-semibold">{d.propertyTitle}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{d.buyerName} ↔ {d.sellerName}</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(d.agreedPricePkr, language)}
                  </td>
                  <td className="p-3 capitalize font-bold text-slate-700 dark:text-slate-300">{d.stage}</td>
                  <td className="p-3 font-semibold text-emerald-600">{formatPKR(d.commissionPkr, language)}</td>
                  <td className="p-3 text-right text-emerald-600 font-semibold">Inspect →</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Deal Detail Modal */}
      {selectedDeal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono text-slate-400">{selectedDeal.dealNumber}</span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Deal Progress & Commission Split
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedDeal(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
                <span className="font-bold text-slate-900 dark:text-slate-100">{selectedDeal.propertyTitle}</span>
                <p className="text-slate-500">Buyer: {selectedDeal.buyerName} ({selectedDeal.buyerPhone})</p>
                <p className="text-slate-500">Seller: {selectedDeal.sellerName} ({selectedDeal.sellerPhone})</p>
                <p className="text-emerald-700 dark:text-emerald-400 font-bold text-sm pt-1">
                  Agreed Price: {formatPKR(selectedDeal.agreedPricePkr, language)}
                </p>
              </div>

              {/* Commission Split */}
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-emerald-600" />
                  Commission Breakdown ({formatPKR(selectedDeal.commissionPkr, language)})
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <span className="text-slate-400 block">Agent Cut ({selectedDeal.commissionSplit.agentPercent}%)</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">
                      {formatPKR(selectedDeal.commissionPkr * (selectedDeal.commissionSplit.agentPercent / 100), language)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">Assigned to: {selectedDeal.agentName}</span>
                  </div>
                  <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                    <span className="text-slate-400 block">Agency Firm Cut ({selectedDeal.commissionSplit.companyPercent}%)</span>
                    <strong className="text-slate-900 dark:text-slate-100 font-bold">
                      {formatPKR(selectedDeal.commissionPkr * (selectedDeal.commissionSplit.companyPercent / 100), language)}
                    </strong>
                    <span className="text-[10px] text-slate-500 block">Office Revenue</span>
                  </div>
                </div>
              </div>

              {/* Update Stage Buttons */}
              <div className="space-y-1">
                <label className="font-bold text-[10px] uppercase text-slate-400">Advance Deal Stage</label>
                <div className="grid grid-cols-3 gap-2">
                  {stages.map((st) => (
                    <button
                      key={st.stage}
                      type="button"
                      onClick={() => {
                        onUpdateDealStage(selectedDeal.id, st.stage);
                        setSelectedDeal({ ...selectedDeal, stage: st.stage });
                      }}
                      className={`p-2 rounded-lg text-[11px] font-semibold transition-colors ${
                        selectedDeal.stage === st.stage
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedDeal(null)}
                className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
