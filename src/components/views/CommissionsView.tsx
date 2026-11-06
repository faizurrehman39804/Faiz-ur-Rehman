import React from 'react';
import { Percent, DollarSign, CheckCircle2, Clock, Users, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { Deal, StaffMember, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface CommissionsViewProps {
  deals: Deal[];
  staff: StaffMember[];
  language: Language;
}

export const CommissionsView: React.FC<CommissionsViewProps> = ({
  deals,
  staff,
  language,
}) => {
  const totalCommissionVolume = deals.reduce((acc, d) => acc + d.commissionPkr, 0);
  const paidCommission = deals
    .filter(d => d.commissionStatus === 'paid')
    .reduce((acc, d) => acc + d.commissionPkr, 0);
  const pendingCommission = totalCommissionVolume - paidCommission;

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Percent className="w-5 h-5 text-emerald-600" />
            <span>Agent Commission & Revenue Share Splits</span>
          </h2>
          <p className="text-xs text-slate-500">
            Transparent deal commission accounting to avoid partnership and staff disputes
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Commission statement downloaded as PDF (Mock Demo)')}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-lg transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>Export Monthly Statement</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Deals Commission</span>
          <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums mt-1">
            {formatPKR(totalCommissionVolume, language)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Across 4 closed/active deals</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Paid to Agents</span>
          <p className="text-2xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums mt-1">
            {formatPKR(paidCommission, language)}
          </p>
          <span className="text-[10px] text-emerald-600 font-semibold mt-1 block">Disbursed on desk</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Pending Clearance</span>
          <p className="text-2xl font-black text-amber-600 tabular-nums mt-1">
            {formatPKR(pendingCommission, language)}
          </p>
          <span className="text-[10px] text-amber-600 font-semibold mt-1 block">Tied to pending installments</span>
        </div>
      </div>

      {/* Commission Ledger Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Per-Deal Commission Schedule & Split Matrix
          </h3>
          <span className="text-xs text-slate-400">Formula: Standard 1% Seller + 1% Buyer</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Deal ID</th>
                <th className="p-3">Property</th>
                <th className="p-3">Agreed Price</th>
                <th className="p-3">Total Commission</th>
                <th className="p-3">Agent Share</th>
                <th className="p-3">Agency Cut</th>
                <th className="p-3">Agent Name</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {deals.map((deal) => {
                const agentCut = deal.commissionPkr * (deal.commissionSplit.agentPercent / 100);
                const companyCut = deal.commissionPkr * (deal.commissionSplit.companyPercent / 100);
                return (
                  <tr key={deal.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-mono font-bold text-slate-900 dark:text-slate-100">{deal.dealNumber}</td>
                    <td className="p-3 font-semibold">{deal.propertyTitle}</td>
                    <td className="p-3 tabular-nums">{formatPKR(deal.agreedPricePkr, language)}</td>
                    <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatPKR(deal.commissionPkr, language)}
                    </td>
                    <td className="p-3 font-bold tabular-nums">
                      {formatPKR(agentCut, language)} ({deal.commissionSplit.agentPercent}%)
                    </td>
                    <td className="p-3 tabular-nums">
                      {formatPKR(companyCut, language)} ({deal.commissionSplit.companyPercent}%)
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-300 font-medium">{deal.agentName}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize ${
                        deal.commissionStatus === 'paid'
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : deal.commissionStatus === 'approved'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                      }`}>
                        {deal.commissionStatus}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
