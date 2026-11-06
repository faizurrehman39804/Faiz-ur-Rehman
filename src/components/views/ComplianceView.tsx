import React, { useState } from 'react';
import { Scale, ShieldCheck, AlertCircle, FileCheck2, Info, CheckCircle2 } from 'lucide-react';
import { Client, Language } from '../../types';
import { calculateKycProgress } from '../../utils/formatters';

interface ComplianceViewProps {
  clients: Client[];
  language: Language;
}

export const ComplianceView: React.FC<ComplianceViewProps> = ({
  clients,
  language,
}) => {
  const [fbrNtn, setFbrNtn] = useState('7491028-4');
  const [kpRegNumber, setKpRegNumber] = useState('KP-REA-2024-0982');
  const [isFbrActive, setIsFbrActive] = useState(true);

  // Compute KYC stats across all clients
  const totalClients = clients.length;
  const verifiedCount = clients.filter(c => calculateKycProgress(c.kyc) === 100).length;
  const kycRate = Math.round((verifiedCount / totalClients) * 100);

  const missingCnicClients = clients.filter(c => !c.kyc.cnicVerified);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Scale className="w-5 h-5 text-emerald-600" />
            <span>Khyber Pakhtunkhwa Real Estate Compliance Center</span>
          </h2>
          <p className="text-xs text-slate-500">
            FBR Active Taxpayer Status, KP Urban Areas Properties Act registration & AML KYC audit
          </p>
        </div>

        <div className="p-2 bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 rounded-lg text-amber-800 dark:text-amber-300 text-[11px] font-semibold flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Disclaimer: Informational management tool, not legal advice.</span>
        </div>
      </div>

      {/* Agency Regulatory Credentials */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Agency Legal Registration & Tax Profile
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">KP Real Estate Agents Reg #</span>
            <input
              type="text"
              value={kpRegNumber}
              onChange={(e) => setKpRegNumber(e.target.value)}
              className="w-full p-1.5 font-bold font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
            />
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Valid through Dec 2027
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">FBR National Tax Number (NTN)</span>
            <input
              type="text"
              value={fbrNtn}
              onChange={(e) => setFbrNtn(e.target.value)}
              className="w-full p-1.5 font-bold font-mono border border-slate-200 dark:border-slate-700 rounded bg-white dark:bg-slate-900"
            />
            <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Active Taxpayer (ATL)
            </span>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Client AML KYC Readiness</span>
            <p className="text-xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
              {kycRate}% Verified
            </p>
            <span className="text-[10px] text-slate-500 font-medium">
              {verifiedCount} of {totalClients} clients fully verified
            </span>
          </div>
        </div>
      </div>

      {/* Missing Documents Action Alert */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600" />
            Clients with Missing CNIC / Verification ({missingCnicClients.length})
          </h3>
          <span className="text-xs text-rose-600 font-semibold">Action Required</span>
        </div>

        <div className="space-y-2 text-xs">
          {missingCnicClients.map((client) => (
            <div
              key={client.id}
              className="p-3 rounded-lg border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between"
            >
              <div>
                <p className="font-bold text-slate-900 dark:text-slate-100">{client.name}</p>
                <p className="text-[11px] text-slate-500">Phone: {client.phone} · CNIC: {client.cnicMasked}</p>
              </div>

              <a
                href={`https://wa.me/92${client.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                  `Assalam-o-Alaikum ${client.name} sahib, baraye meharbani apni CNIC copy aur tasweer PropDesk office file k liye share farma dein.`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 bg-rose-600 text-white rounded font-semibold text-[11px]"
              >
                Request CNIC
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Record Retention Policy Card */}
      <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 space-y-1">
        <h4 className="font-bold text-slate-900 dark:text-slate-100">
          Statutory 5-Year Record Retention Policy
        </h4>
        <p>
          Under the KPK Urban Immovable Property Tax Act & AML Guidelines, all computerized transaction ledgers, token receipts, and verified copies of CNICs are archived digitally for a minimum of 5 years.
        </p>
      </div>

    </div>
  );
};
