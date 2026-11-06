import React from 'react';
import { Settings, Shield, RefreshCw, Check, CheckCircle2, Cloud, Lock } from 'lucide-react';
import { DealerSettings, Language } from '../../types';

interface SettingsViewProps {
  settings: DealerSettings;
  onUpdateSettings: (settings: Partial<DealerSettings>) => void;
  onResetDemoData: () => void;
  language: Language;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  onResetDemoData,
  language,
}) => {
  return (
    <div className="space-y-6 max-w-4xl">
      
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-emerald-600" />
          <span>Agency Settings & Rebranding Console</span>
        </h2>
        <p className="text-xs text-slate-500">
          Rebrand PropDesk for any property dealer in Peshawar before your sales meeting
        </p>
      </div>

      {/* Business Identity */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Dealership Profile (Shown on Receipts & Public Website)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Agency Name</label>
            <input
              type="text"
              value={settings.dealerName}
              onChange={(e) => onUpdateSettings({ dealerName: e.target.value })}
              className="w-full p-2.5 font-bold border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => onUpdateSettings({ tagline: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location Area</label>
            <input
              type="text"
              value={settings.area}
              onChange={(e) => onUpdateSettings({ area: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Official WhatsApp Phone</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => onUpdateSettings({ phone: e.target.value })}
              className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Physical Office Address</label>
          <textarea
            rows={2}
            value={settings.address}
            onChange={(e) => onUpdateSettings({ address: e.target.value })}
            className="w-full p-2.5 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
          />
        </div>
      </div>

      {/* Cloud Backup & Security */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-3">
          Data Integrity & Backup Status
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">Automated Daily Cloud Backup</span>
              <p className="text-[11px] text-slate-500 mt-0.5">{settings.lastBackup}</p>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Healthy
            </span>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100">Two-Factor SMS / WhatsApp Login</span>
              <p className="text-[11px] text-slate-500 mt-0.5">Protects owner receipts and ledger</p>
            </div>
            <input
              type="checkbox"
              checked={settings.is2FAEnabled}
              onChange={(e) => onUpdateSettings({ is2FAEnabled: e.target.checked })}
              className="h-4 w-4 rounded text-emerald-600 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Reset Demo Data */}
      <div className="p-5 border border-rose-200 dark:border-rose-900/60 bg-rose-50/40 dark:bg-rose-950/20 rounded-xl flex items-center justify-between text-xs">
        <div>
          <h4 className="font-bold text-rose-800 dark:text-rose-200">
            Reset Demo Data to Initial Peshawar Seed
          </h4>
          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80">
            Restores all 25 leads, 30 properties, client ledgers, and DHA/Regi plot grids to pristine demo state.
          </p>
        </div>

        <button
          type="button"
          onClick={onResetDemoData}
          className="flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-lg text-xs shadow-xs"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Reset All Demo Data</span>
        </button>
      </div>

    </div>
  );
};
