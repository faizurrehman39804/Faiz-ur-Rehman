import React from 'react';
import { BarChart3, TrendingUp, Download, PieChart, Users, Building2 } from 'lucide-react';
import { Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface ReportsViewProps {
  language: Language;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ language }) => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-600" />
            <span>Reports, Revenue & Conversion Analytics</span>
          </h2>
          <p className="text-xs text-slate-500">
            Performance metrics for owner decisions, sales velocity, and regional market demand
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => alert('Exporting Excel Sheet (Mock Demo)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Excel</span>
          </button>
          <button
            type="button"
            onClick={() => alert('Exporting PDF Audit Report (Mock Demo)...')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-xs font-semibold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>

      {/* Grid of Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Sales by Area in Peshawar */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Sales Volume by Peshawar Area
            </h3>
            <span className="text-[10px] text-emerald-600 font-bold">Q4 2026</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { area: 'Hayatabad (Phase 1-7)', volume: 64000000, percent: 80, color: 'bg-emerald-600' },
              { area: 'DHA Peshawar', volume: 38000000, percent: 55, color: 'bg-blue-600' },
              { area: 'Regi Model Town', volume: 22000000, percent: 35, color: 'bg-amber-600' },
              { area: 'University Town', volume: 18000000, percent: 28, color: 'bg-purple-600' },
              { area: 'Ring Road Commercial', volume: 27500000, percent: 42, color: 'bg-rose-600' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.area}</span>
                  <span className="font-bold tabular-nums text-slate-900 dark:text-slate-100">{formatPKR(item.volume, language)}</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Lead Conversion Funnel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Inbound Conversion Rates
            </h3>
            <span className="text-[10px] text-blue-600 font-bold">18.4% Win Rate</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Total Leads Received</span>
                <p className="text-[10px] text-slate-500">WhatsApp, Walk-in, Facebook, Portals</p>
              </div>
              <span className="font-black text-base text-slate-900 dark:text-slate-100">54 Leads</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Site Visits Conducted</span>
                <p className="text-[10px] text-slate-500">62% of qualified leads visited property</p>
              </div>
              <span className="font-black text-base text-blue-600">34 Visits</span>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg flex justify-between items-center">
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200">Tokens Received & Deals</span>
                <p className="text-[10px] text-slate-500">Closed transactions this quarter</p>
              </div>
              <span className="font-black text-base text-emerald-600">10 Deals</span>
            </div>
          </div>
        </div>

        {/* Overdue Aging Matrix */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              Installments Aging & Health
            </h3>
            <span className="text-[10px] text-rose-600 font-bold">Aging Bracket</span>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { bracket: 'Current (Not Due)', val: 'Rs 4.2 Crore', status: 'Healthy', color: 'text-emerald-600' },
              { bracket: '1 - 15 Days Overdue', val: 'Rs 40 Lakh', status: 'Follow Up', color: 'text-amber-600' },
              { bracket: '16 - 30 Days Overdue', val: 'Rs 25 Lakh', status: 'High Alert', color: 'text-rose-600' },
              { bracket: '30+ Days Overdue', val: 'Rs 0', status: 'Clear', color: 'text-slate-400' },
            ].map((ag, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{ag.bracket}</span>
                  <p className="text-[10px] text-slate-400">{ag.status}</p>
                </div>
                <span className={`font-bold tabular-nums ${ag.color}`}>{ag.val}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
