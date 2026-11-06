import React, { useState } from 'react';
import { FolderLock, Upload, FileText, CheckCircle2, AlertTriangle, Shield, Search } from 'lucide-react';
import { Language } from '../../types';

interface DocumentsViewProps {
  language: Language;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ language }) => {
  const [activeFolder, setActiveFolder] = useState<'all' | 'pda' | 'fard' | 'agreements'>('all');

  const docs = [
    { id: 'doc-1', title: 'PDA Allotment Letter - Hayatabad Phase 3 Spanish Villa', category: 'pda', size: '2.4 MB', date: '2026-10-12', verified: true },
    { id: 'doc-2', title: 'Original Fard Malkiat - Ring Road Commercial Plot', category: 'fard', size: '1.8 MB', date: '2026-10-20', verified: true },
    { id: 'doc-3', title: 'Bayana Token Agreement - Saddar Cantt Shop #4', category: 'agreements', size: '3.1 MB', date: '2026-10-25', verified: true },
    { id: 'doc-4', title: 'DHA Allocation & NDC Slip - Sector B Plot B-14', category: 'pda', size: '1.2 MB', date: '2026-11-01', verified: true },
    { id: 'doc-5', title: 'Patwari Aks Shajra & Mutation Extract - Regi Model Town', category: 'fard', size: '4.5 MB', date: '2026-10-28', verified: false },
    { id: 'doc-6', title: 'Rental Tenancy Contract - Board Bazaar Shop #14', category: 'agreements', size: '1.5 MB', date: '2026-09-15', verified: true },
  ];

  const filteredDocs = docs.filter(d => activeFolder === 'all' || d.category === activeFolder);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-emerald-600" />
            <span>Digital Document Vault & Revenue Records</span>
          </h2>
          <p className="text-xs text-slate-500">
            Secure cloud storage for PDA allotment letters, patwari fard, and stamped agreements
          </p>
        </div>

        <button
          type="button"
          onClick={() => alert('Document Upload dialog triggered (Mock Demo)')}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
        >
          <Upload className="w-4 h-4" />
          <span>Upload File</span>
        </button>
      </div>

      {/* Folder Filters */}
      <div className="flex items-center gap-2 text-xs font-semibold">
        {[
          { id: 'all', label: 'All Vault Files (6)' },
          { id: 'pda', label: 'PDA & DHA Allotments' },
          { id: 'fard', label: 'Revenue Fard & Shajra' },
          { id: 'agreements', label: 'Sale Agreements & Tokan' },
        ].map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFolder(f.id as any)}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeFolder === f.id
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Document Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div
            key={doc.id}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 shadow-xs flex items-start justify-between gap-3 text-xs"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 shrink-0 mt-0.5">
                <FileText className="w-5 h-5" />
              </div>
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {doc.title}
                </h4>
                <p className="text-[11px] text-slate-500 font-mono">
                  {doc.size} · Uploaded {doc.date}
                </p>
                {doc.verified ? (
                  <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Patwari / PDA Verified
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-600 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Verification Pending
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => alert(`Viewing file preview for ${doc.title}`)}
              className="px-2 py-1 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-semibold rounded text-[11px] shrink-0"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* Upload Dropzone Mock */}
      <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl text-center space-y-2 bg-slate-50/50 dark:bg-slate-900/40">
        <Upload className="w-8 h-8 mx-auto text-slate-400" />
        <h4 className="font-bold text-sm text-slate-700 dark:text-slate-300">
          Drop Registry Copy, Fard Malkiat or Agreement PDF here
        </h4>
        <p className="text-xs text-slate-500">
          Files are encrypted and watermarked with dealership copyright automatically.
        </p>
      </div>

    </div>
  );
};
