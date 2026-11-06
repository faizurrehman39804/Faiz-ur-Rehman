import React, { useState, useEffect } from 'react';
import { Search, X, Building2, Users2, UserCheck, ArrowRight, MapPin, Receipt } from 'lucide-react';
import { ViewKey } from './Sidebar';
import { Lead, Property, Client, Language } from '../types';
import { formatPKR } from '../utils/formatters';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: ViewKey) => void;
  leads: Lead[];
  properties: Property[];
  clients: Client[];
  language: Language;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  leads,
  properties,
  clients,
  language,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Navigation targets
  const allViews: { key: ViewKey; label: string; group: string }[] = [
    { key: 'dashboard', label: 'Dashboard & KPIs', group: 'Navigation' },
    { key: 'leads', label: 'Leads CRM & Pipeline', group: 'Navigation' },
    { key: 'inventory', label: 'Property Inventory & Listings', group: 'Navigation' },
    { key: 'societies', label: 'Societies & Interactive Plot Maps', group: 'Navigation' },
    { key: 'payments', label: 'Payments, Installments & Receipts', group: 'Navigation' },
    { key: 'deals', label: 'Deals & Bookings', group: 'Navigation' },
    { key: 'clients', label: 'Clients & KYC Verification', group: 'Navigation' },
    { key: 'rentals', label: 'Rentals & Tenants Tracker', group: 'Navigation' },
    { key: 'whatsapp', label: 'WhatsApp Center & Templates', group: 'Navigation' },
    { key: 'website', label: 'Public Website Builder Preview', group: 'Navigation' },
    { key: 'client_portal', label: 'Client Investor Portal Preview', group: 'Navigation' },
    { key: 'reports', label: 'Reports & Revenue Analytics', group: 'Navigation' },
    { key: 'compliance', label: 'KP Property Compliance Center', group: 'Navigation' },
    { key: 'marketing', label: 'Marketing Copy & Poster Generator', group: 'Navigation' },
    { key: 'expenses', label: 'Office Expenses & Accounts', group: 'Navigation' },
    { key: 'settings', label: 'Branding & Dealer Settings', group: 'Navigation' },
  ];

  const filteredViews = allViews.filter(v => v.label.toLowerCase().includes(q));

  const filteredLeads = leads
    .filter(l => l.name.toLowerCase().includes(q) || l.location.toLowerCase().includes(q) || l.requirement.toLowerCase().includes(q))
    .slice(0, 4);

  const filteredProps = properties
    .filter(p => p.title.toLowerCase().includes(q) || p.location.toLowerCase().includes(q))
    .slice(0, 4);

  const filteredClients = clients
    .filter(c => c.name.toLowerCase().includes(q) || c.cnicMasked.includes(q))
    .slice(0, 3);

  const handleSelectView = (key: ViewKey) => {
    onNavigate(key);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Box */}
        <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type a module, lead, property, or client (e.g. 'DHA', 'Installments')..."
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-3 space-y-4 text-xs">
          {/* Views */}
          {filteredViews.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Modules & Views
              </span>
              <div className="mt-1 space-y-0.5">
                {filteredViews.slice(0, 5).map((v) => (
                  <button
                    key={v.key}
                    type="button"
                    onClick={() => handleSelectView(v.key)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-emerald-50 dark:hover:bg-emerald-950/60 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors text-left"
                  >
                    <span>{v.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Properties */}
          {filteredProps.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Properties
              </span>
              <div className="mt-1 space-y-1">
                {filteredProps.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectView('inventory')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Building2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{p.title}</span>
                    </div>
                    <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 shrink-0 ml-2">
                      {formatPKR(p.pricePkr, 'en')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Leads */}
          {filteredLeads.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                CRM Leads
              </span>
              <div className="mt-1 space-y-1">
                {filteredLeads.map((l) => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => handleSelectView('leads')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Users2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span className="truncate font-medium">{l.name}</span>
                      <span className="text-[10px] text-slate-400 truncate">({l.requirement})</span>
                    </div>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize shrink-0 ml-2">
                      {l.status.replace('_', ' ')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Clients */}
          {filteredClients.length > 0 && (
            <div>
              <span className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Clients Directory
              </span>
              <div className="mt-1 space-y-1">
                {filteredClients.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectView('clients')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-left"
                  >
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span className="font-medium">{c.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {c.cnicMasked}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {filteredViews.length === 0 && filteredProps.length === 0 && filteredLeads.length === 0 && (
            <div className="text-center py-8 text-slate-400">
              No matching records found for "{query}". Try searching 'DHA', 'Hayatabad', or 'Receipt'.
            </div>
          )}
        </div>

        {/* Footer Shortcut Note */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
          <span>Navigate with arrows or mouse click</span>
          <span>Esc to exit</span>
        </div>

      </div>
    </div>
  );
};
