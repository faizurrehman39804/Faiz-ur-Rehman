import React, { useState } from 'react';
import { 
  Users2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  Table as TableIcon, 
  MessageSquare, 
  PhoneCall, 
  CalendarDays, 
  Handshake, 
  ChevronRight, 
  X, 
  Building2, 
  ArrowRight,
  Flame,
  Clock,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { Lead, LeadStatus, Property, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface LeadsViewProps {
  leads: Lead[];
  properties: Property[];
  onUpdateLeadStatus: (leadId: string, newStatus: LeadStatus) => void;
  onAddLead: (lead: Lead) => void;
  onConvertToDeal: (lead: Lead) => void;
  language: Language;
}

export const LeadsView: React.FC<LeadsViewProps> = ({
  leads,
  properties,
  onUpdateLeadStatus,
  onAddLead,
  onConvertToDeal,
  language,
}) => {
  const t = translations[language];

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // New lead modal
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newLeadForm, setNewLeadForm] = useState<{
    name: string;
    phone: string;
    requirement: string;
    location: string;
    budgetPkr: string;
    source: Lead['source'];
    priority: Lead['priority'];
  }>({
    name: '',
    phone: '0300-',
    requirement: '',
    location: 'Hayatabad Phase 3',
    budgetPkr: '15000000',
    source: 'WhatsApp',
    priority: 'hot',
  });

  const columns: { status: LeadStatus; labelEn: string; labelUr: string; color: string }[] = [
    { status: 'new', labelEn: 'New Inquiries', labelUr: 'نئی انکوائریز', color: 'border-blue-500' },
    { status: 'contacted', labelEn: 'Contacted', labelUr: 'رابطہ ہو گیا', color: 'border-indigo-500' },
    { status: 'site_visit', labelEn: 'Site Visit Scheduled', labelUr: 'سائٹ وزٹ', color: 'border-amber-500' },
    { status: 'negotiation', labelEn: 'In Negotiation', labelUr: 'بات چیت جاری', color: 'border-purple-500' },
    { status: 'closed_won', labelEn: 'Closed (Won)', labelUr: 'کامیاب ڈیل', color: 'border-emerald-500' },
    { status: 'closed_lost', labelEn: 'Closed (Lost)', labelUr: 'منسوخ شدہ', color: 'border-slate-400' },
  ];

  // Filter leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch = 
      l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.requirement.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'all' || l.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || l.status === statusFilter;
    return matchesSearch && matchesSource && matchesStatus;
  });

  // Auto-matched properties for selected lead
  const matchingProperties = selectedLead
    ? properties.filter(
        p =>
          p.status === 'available' &&
          (p.location.toLowerCase().includes(selectedLead.location.toLowerCase().split(' ')[0]) ||
            p.society.toLowerCase().includes(selectedLead.location.toLowerCase().split(' ')[0]) ||
            Math.abs(p.pricePkr - selectedLead.budgetPkr) < selectedLead.budgetPkr * 0.4)
      )
    : [];

  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadForm.name) return;
    const lead: Lead = {
      id: `lead-${Date.now()}`,
      name: newLeadForm.name,
      phone: newLeadForm.phone,
      email: `${newLeadForm.name.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      requirement: newLeadForm.requirement || 'Plot or House Inquiry',
      propertyType: 'plot',
      location: newLeadForm.location,
      budgetPkr: Number(newLeadForm.budgetPkr) || 10000000,
      source: newLeadForm.source,
      status: 'new',
      agentId: 'staff-1',
      agentName: 'Faiz Rehman',
      priority: newLeadForm.priority,
      nextFollowUp: new Date().toISOString().split('T')[0],
      notes: 'Captured via PropDesk Leads Manager',
      createdAt: new Date().toISOString().split('T')[0],
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: 'Lead created', user: 'Faiz Rehman' },
      ],
    };
    onAddLead(lead);
    setIsAddModalOpen(false);
    setNewLeadForm({
      name: '',
      phone: '0300-',
      requirement: '',
      location: 'Hayatabad Phase 3',
      budgetPkr: '15000000',
      source: 'WhatsApp',
      priority: 'hot',
    });
  };

  const priorityBadge = (p: string) => {
    if (p === 'hot') return <span className="text-[10px] px-1.5 py-0.5 rounded font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-0.5"><Flame className="w-3 h-3" /> HOT</span>;
    if (p === 'warm') return <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">WARM</span>;
    return <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">COLD</span>;
  };

  return (
    <div className="space-y-5">
      
      {/* Header & Quick Capture Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.navLeads}
          </h2>
          <p className="text-xs text-slate-500">
            Peshawar real estate inquiries pipeline & fast WhatsApp CRM
          </p>
        </div>

        {/* 5-Second Quick-Capture Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setNewLeadForm({ ...newLeadForm, source: 'WhatsApp' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 hover:bg-emerald-100 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>+ WhatsApp Inquiry</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setNewLeadForm({ ...newLeadForm, source: 'Walk-in' });
              setIsAddModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-colors"
          >
            <span>+ Walk-in Client</span>
          </button>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>{t.addLead}</span>
          </button>
        </div>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-72 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search leads by name, area, or budget..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Sources</option>
            <option value="WhatsApp">WhatsApp</option>
            <option value="Walk-in">Walk-in</option>
            <option value="Facebook">Facebook</option>
            <option value="Zameen">Zameen.com</option>
            <option value="Referral">Referral</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Stages</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="site_visit">Site Visit</option>
            <option value="negotiation">Negotiation</option>
            <option value="closed_won">Closed (Won)</option>
            <option value="closed_lost">Closed (Lost)</option>
          </select>

          {/* Kanban / Table Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('kanban')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'kanban' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
              }`}
              title="Kanban Board"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'table' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
              }`}
              title="Table View"
            >
              <TableIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

      {/* Kanban Board View */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 min-h-[500px]">
          {columns.map((col) => {
            const columnLeads = filteredLeads.filter(l => l.status === col.status);
            return (
              <div
                key={col.status}
                className="bg-slate-100/70 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200/80 dark:border-slate-800/80 flex flex-col space-y-2.5"
              >
                {/* Column Header */}
                <div className={`border-t-2 ${col.color} pt-1.5 flex items-center justify-between`}>
                  <span className="font-bold text-xs text-slate-800 dark:text-slate-200">
                    {language === 'ur' ? col.labelUr : col.labelEn}
                  </span>
                  <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {columnLeads.length}
                  </span>
                </div>

                {/* Cards Container */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[70vh]">
                  {columnLeads.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-lg">
                      No leads here
                    </div>
                  ) : (
                    columnLeads.map((lead) => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLead(lead)}
                        className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 transition-all cursor-pointer shadow-xs space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          {priorityBadge(lead.priority)}
                          <span className="text-[10px] font-medium text-slate-400">{lead.source}</span>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
                            {lead.name}
                          </h4>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 line-clamp-1 mt-0.5">
                            {lead.requirement}
                          </p>
                        </div>

                        <div className="pt-1 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-[11px]">
                          <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                            {formatPKR(lead.budgetPkr, language)}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[80px]">
                            {lead.location.split(' ')[0]}
                          </span>
                        </div>

                        {/* Quick action buttons on card */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-500">
                          <span className="truncate">Agent: {lead.agentName.split(' ')[0]}</span>
                          <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                            <a
                              href={`https://wa.me/92${lead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                                `Assalam-o-Alaikum ${lead.name} sahib, PropDesk / Khyber Heritage Real Estate se rabta kar rahe hain aapki inquiry k baray mein.`
                              )}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-emerald-600 hover:text-emerald-700"
                              title="Chat WhatsApp"
                            >
                              <MessageSquare className="w-3.5 h-3.5" />
                            </a>
                            <a
                              href={`tel:${lead.phone}`}
                              className="text-slate-500 hover:text-slate-700"
                              title="Call"
                            >
                              <PhoneCall className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
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
                <th className="p-3">Client Name</th>
                <th className="p-3">Requirement</th>
                <th className="p-3">Location</th>
                <th className="p-3">Budget</th>
                <th className="p-3">Source</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Stage</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredLeads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLead(lead)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                    {lead.name}
                    <div className="text-[10px] text-slate-400 font-normal">{lead.phone}</div>
                  </td>
                  <td className="p-3 text-slate-700 dark:text-slate-300">{lead.requirement}</td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{lead.location}</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(lead.budgetPkr, language)}
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{lead.source}</td>
                  <td className="p-3">{priorityBadge(lead.priority)}</td>
                  <td className="p-3">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium capitalize">
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedLead(lead)}
                      className="px-2.5 py-1 text-xs text-emerald-600 font-semibold hover:bg-emerald-50 rounded"
                    >
                      Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Lead Detail Side Drawer */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
            onClick={() => setSelectedLead(null)} 
            aria-hidden="true" 
          />
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <aside aria-label="Lead Details" className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
              
              {/* Drawer Top */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                    Lead CRM
                  </span>
                  {priorityBadge(selectedLead.priority)}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedLead(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Profile Info */}
              <div className="p-5 border-b border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                      {selectedLead.name}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {selectedLead.phone} · {selectedLead.email}
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
                    {formatPKR(selectedLead.budgetPkr, language)}
                  </span>
                </div>

                {/* Stage Shift Selector */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-400">Pipeline Stage</label>
                  <select
                    value={selectedLead.status}
                    onChange={(e) => {
                      const newSt = e.target.value as LeadStatus;
                      onUpdateLeadStatus(selectedLead.id, newSt);
                      setSelectedLead({ ...selectedLead, status: newSt });
                    }}
                    className="w-full p-2 text-xs font-semibold rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200"
                  >
                    <option value="new">1. New Inquiries</option>
                    <option value="contacted">2. Contacted</option>
                    <option value="site_visit">3. Site Visit Scheduled</option>
                    <option value="negotiation">4. In Negotiation</option>
                    <option value="closed_won">5. Closed (Won)</option>
                    <option value="closed_lost">6. Closed (Lost)</option>
                  </select>
                </div>

                {/* Fast Action Buttons */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  <a
                    href={`https://wa.me/92${selectedLead.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${selectedLead.phone}`}
                    className="flex items-center justify-center gap-1.5 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    Call
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onConvertToDeal(selectedLead);
                      setSelectedLead(null);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold"
                  >
                    <Handshake className="w-3.5 h-3.5" />
                    To Deal
                  </button>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs">
                
                {/* Auto-Matched Properties from Inventory */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Building2 className="w-4 h-4 text-emerald-600" />
                      Auto-Matched Inventory ({matchingProperties.length})
                    </h4>
                    <span className="text-[10px] text-slate-400">Smart Match</span>
                  </div>

                  {matchingProperties.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic">No exact matching inventory at this budget.</p>
                  ) : (
                    <div className="space-y-2">
                      {matchingProperties.slice(0, 3).map((prop) => (
                        <div
                          key={prop.id}
                          className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between"
                        >
                          <div>
                            <p className="font-bold text-slate-900 dark:text-slate-100 line-clamp-1">{prop.title}</p>
                            <p className="text-[10px] text-slate-500">{prop.location} · {prop.sizeMarla} Marla</p>
                            <p className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                              {formatPKR(prop.pricePkr, language)}
                            </p>
                          </div>
                          <a
                            href={`https://wa.me/92${selectedLead.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                              `Assalam-o-Alaikum ${selectedLead.name} sahib, aapki demand k mutabiq ye property check karein:\n*${prop.title}*\nLocation: ${prop.location}\nSize: ${prop.sizeMarla} Marla\nDemand: ${formatPKR(prop.pricePkr, 'en')}`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700"
                            title="Send this property to client on WhatsApp"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Activity Timeline */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <h4 className="font-bold text-slate-900 dark:text-slate-100">
                    Activity Timeline & Notes
                  </h4>
                  <div className="space-y-2">
                    {selectedLead.timeline.map((act, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px]">
                        <span className="font-mono text-slate-400 shrink-0">{act.date}</span>
                        <div>
                          <p className="text-slate-700 dark:text-slate-300">{act.action}</p>
                          <span className="text-[10px] text-slate-400">By {act.user}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </aside>
          </div>
        </div>
      )}

      {/* Add Lead Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-5 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Log New Lead (Inquiry)
              </h3>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLead} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.name}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, name: e.target.value })}
                  placeholder="e.g. Haji Asif Shinwari"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={newLeadForm.phone}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Lead Source</label>
                  <select
                    value={newLeadForm.source}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, source: e.target.value as any })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="WhatsApp">WhatsApp Inquiry</option>
                    <option value="Walk-in">Walk-in Showroom</option>
                    <option value="Facebook">Facebook Ad</option>
                    <option value="Zameen">Zameen.com</option>
                    <option value="Referral">Referral / Relative</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Requirement</label>
                <input
                  type="text"
                  required
                  value={newLeadForm.requirement}
                  onChange={(e) => setNewLeadForm({ ...newLeadForm, requirement: e.target.value })}
                  placeholder="e.g. 5 Marla Plot or 10 Marla Luxury House"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Target Area</label>
                  <select
                    value={newLeadForm.location}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, location: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="Hayatabad Phase 1-7">Hayatabad Phase 1-7</option>
                    <option value="DHA Peshawar">DHA Peshawar</option>
                    <option value="Regi Model Town">Regi Model Town</option>
                    <option value="University Town">University Town</option>
                    <option value="Warsak Road">Warsak Road</option>
                    <option value="Ring Road">Ring Road</option>
                    <option value="New Peshawar Valley">New Peshawar Valley</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Budget (PKR)</label>
                  <input
                    type="number"
                    step="100000"
                    value={newLeadForm.budgetPkr}
                    onChange={(e) => setNewLeadForm({ ...newLeadForm, budgetPkr: e.target.value })}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
