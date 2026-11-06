import React, { useState } from 'react';
import { 
  UserCheck, 
  Plus, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  PhoneCall, 
  MessageSquare, 
  FileText, 
  Handshake, 
  X,
  CreditCard
} from 'lucide-react';
import { Client, Language } from '../../types';
import { formatPKR, calculateKycProgress } from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface ClientsViewProps {
  clients: Client[];
  onAddClient: (client: Client) => void;
  onUpdateKyc: (clientId: string, kyc: Client['kyc']) => void;
  language: Language;
}

export const ClientsView: React.FC<ClientsViewProps> = ({
  clients,
  onAddClient,
  onUpdateKyc,
  language,
}) => {
  const t = translations[language];

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [typeFilter, setTypeFilter] = useState('all');

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.cnicMasked.includes(searchQuery);
    const matchesType = typeFilter === 'all' || c.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getKycBadge = (client: Client) => {
    const progress = calculateKycProgress(client.kyc);
    if (progress === 100) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> KYC 100%
        </span>
      );
    }
    if (progress >= 40) {
      return (
        <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
          KYC {progress}% Partial
        </span>
      );
    }
    return (
      <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
        KYC {progress}% Missing
      </span>
    );
  };

  return (
    <div className="space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.navClients}
          </h2>
          <p className="text-xs text-slate-500">
            Directory of Peshawar buyers, sellers, overseas investors, and FBR/KP compliance KYC checklist
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="p-1.5 text-xs border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
          >
            <option value="all">All Categories</option>
            <option value="buyer">Buyers</option>
            <option value="seller">Sellers</option>
            <option value="investor">Investors</option>
            <option value="tenant">Tenants</option>
          </select>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center gap-2 shadow-xs">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search by client name, masked CNIC, or category..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-transparent text-xs w-full focus:outline-none text-slate-900 dark:text-slate-100"
        />
      </div>

      {/* Clients Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredClients.map((client) => {
          const progress = calculateKycProgress(client.kyc);
          return (
            <div
              key={client.id}
              onClick={() => setSelectedClient(client)}
              className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/70 transition-all cursor-pointer shadow-xs space-y-3 group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                    {client.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                    CNIC: {client.cnicMasked}
                  </p>
                </div>
                {getKycBadge(client)}
              </div>

              <div className="text-xs text-slate-600 dark:text-slate-400">
                <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">{client.type}</span> · {client.phone}
              </div>

              {/* Progress Ring / KYC Meter */}
              <div className="space-y-1 pt-1 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>KYC Documents Verified</span>
                  <span className="font-bold">{progress}%</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      progress === 100 ? 'bg-emerald-600' : progress >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-slate-500">{client.dealsCount} Deals Closed</span>
                <span className="font-bold text-emerald-700 dark:text-emerald-400">
                  Vol: {formatPKR(client.totalVolumePkr, language)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Client Detail & KYC Drawer */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setSelectedClient(null)} 
            aria-hidden="true" 
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <aside aria-label="Client KYC File" className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
              
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    Client KYC Dossier
                  </span>
                  {getKycBadge(selectedClient)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-5 text-xs flex-1">
                
                {/* Details */}
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedClient.name}
                  </h3>
                  <p className="text-slate-500 font-mono">
                    CNIC: {selectedClient.cnicMasked}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400">
                    Phone: {selectedClient.phone} · Email: {selectedClient.email}
                  </p>
                </div>

                {/* KYC Interactive Checklist */}
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    KP / FBR Anti-Money Laundering KYC Checklist
                  </h4>

                  <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClient.kyc.cnicVerified}
                        onChange={(e) => {
                          const updated = { ...selectedClient.kyc, cnicVerified: e.target.checked };
                          onUpdateKyc(selectedClient.id, updated);
                          setSelectedClient({ ...selectedClient, kyc: updated });
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        CNIC Copy & NADRA Verisys Record (40%)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClient.kyc.photoVerified}
                        onChange={(e) => {
                          const updated = { ...selectedClient.kyc, photoVerified: e.target.checked };
                          onUpdateKyc(selectedClient.id, updated);
                          setSelectedClient({ ...selectedClient, kyc: updated });
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Passport-size Photographs & Signatures (30%)
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedClient.kyc.sourceOfFundsVerified}
                        onChange={(e) => {
                          const updated = { ...selectedClient.kyc, sourceOfFundsVerified: e.target.checked };
                          onUpdateKyc(selectedClient.id, updated);
                          setSelectedClient({ ...selectedClient, kyc: updated });
                        }}
                        className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        Source of Funds / Bank Statement (30%)
                      </span>
                    </label>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-1">
                  <span className="font-bold uppercase text-[10px] text-slate-400">Agent Background Notes</span>
                  <p className="p-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg text-slate-700 dark:text-slate-300">
                    {selectedClient.notes || 'No confidential background notes.'}
                  </p>
                </div>

                {/* Direct Comms */}
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <a
                    href={`https://wa.me/92${selectedClient.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Chat WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedClient.phone}`}
                    className="flex items-center justify-center gap-2 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg font-semibold"
                  >
                    <PhoneCall className="w-4 h-4" />
                    Call Client
                  </a>
                </div>

              </div>

            </aside>
          </div>
        </div>
      )}

    </div>
  );
};
