import React, { useState } from 'react';
import { 
  Users2, 
  Building2, 
  Handshake, 
  Receipt, 
  AlertCircle, 
  CalendarDays, 
  TrendingUp, 
  ArrowUpRight, 
  MessageSquare, 
  PhoneCall, 
  CheckCircle2, 
  Plus, 
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { 
  Lead, 
  Property, 
  Deal, 
  InstallmentPlan, 
  SiteVisit, 
  StaffMember, 
  DealerSettings, 
  Language, 
  UserRole 
} from '../../types';
import { formatPKR } from '../../utils/formatters';
import { translations } from '../../utils/translations';
import { ViewKey } from '../Sidebar';

interface DashboardViewProps {
  leads: Lead[];
  properties: Property[];
  deals: Deal[];
  installmentPlans: InstallmentPlan[];
  visits: SiteVisit[];
  staff: StaffMember[];
  settings: DealerSettings;
  language: Language;
  currentRole: UserRole;
  onNavigate: (view: ViewKey) => void;
  onQuickAdd: () => void;
  onSendWhatsAppReminder: (clientName: string, amount: number, dueDate: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  leads,
  properties,
  deals,
  installmentPlans,
  visits,
  staff,
  settings,
  language,
  currentRole,
  onNavigate,
  onQuickAdd,
  onSendWhatsAppReminder,
}) => {
  const t = translations[language];

  // Follow-ups state for checkable tasks
  const [completedFollowUps, setCompletedFollowUps] = useState<string[]>([]);

  // Calculate high-level KPIs
  const newLeadsCount = leads.filter(l => l.status === 'new').length;
  const activeDealsCount = deals.filter(d => d.stage !== 'closed').length;
  const availablePropsCount = properties.filter(p => p.status === 'available').length;
  const todaysVisitsCount = visits.filter(v => v.status === 'scheduled').length;

  // Overdue installments calculation
  const overdueList: { clientName: string; phone: string; property: string; amount: number; dueDate: string }[] = [];
  let totalOverduePkr = 0;

  installmentPlans.forEach(plan => {
    plan.installments.forEach(inst => {
      if (inst.status === 'overdue') {
        overdueList.push({
          clientName: plan.clientName,
          phone: plan.clientPhone,
          property: plan.propertyTitle,
          amount: inst.amountPkr,
          dueDate: inst.dueDate,
        });
        totalOverduePkr += inst.amountPkr;
      }
    });
  });

  // Monthly collection vs target calculation
  const totalCollectedThisMonth = 6500000;
  const monthlyTarget = 10000000;
  const collectionPercent = Math.round((totalCollectedThisMonth / monthlyTarget) * 100);

  // Toggle follow-up completion
  const handleToggleFollowUp = (id: string) => {
    if (completedFollowUps.includes(id)) {
      setCompletedFollowUps(completedFollowUps.filter(x => x !== id));
    } else {
      setCompletedFollowUps([...completedFollowUps, id]);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome Strip */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
            <span>{settings.dealerName}</span>
            <span>·</span>
            <span>{settings.area}, {settings.city}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {language === 'ur' ? 'پشاور رئیل اسٹیٹ ڈیش بورڈ' : 'Dealer Operations Command Center'}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed max-w-2xl">
            {language === 'ur'
              ? 'آج کا مکمل حساب: بقایا اقساط، متوقع سائٹ وزٹس اور زیرِ التواء ڈیلز کا خلاصہ ایک نظر میں۔'
              : 'Real-time overview of current leads, overdue installment collections, today\'s site visits, and Peshawar inventory.'}
          </p>
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onQuickAdd}
              className="px-4 py-2 bg-white text-emerald-950 font-bold text-xs rounded-lg hover:bg-emerald-50 transition-colors shadow-xs"
            >
              + {t.quickAdd}
            </button>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-medium text-xs rounded-lg transition-colors border border-emerald-600/50"
            >
              View Leads CRM ({leads.length})
            </button>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className="px-4 py-2 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-medium text-xs rounded-lg transition-colors border border-emerald-600/50"
            >
              Overdue Ledger ({formatPKR(totalOverduePkr, language)})
            </button>
          </div>
        </div>

        {/* Decorative subtle backdrop ornament */}
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-8 translate-y-8">
          <Building2 className="w-80 h-80 text-white" />
        </div>
      </div>

      {/* KPI Tiles (6-Card Responsive Grid) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* New Leads */}
        <div 
          onClick={() => onNavigate('leads')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiNewLeads}</span>
            <Users2 className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {newLeadsCount}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
            <span>+4 from WhatsApp</span>
          </div>
        </div>

        {/* Site Visits */}
        <div 
          onClick={() => onNavigate('calendar')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiSiteVisits}</span>
            <CalendarDays className="w-4 h-4 text-blue-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {todaysVisitsCount}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-blue-600 font-semibold">
            <span>Hayatabad & DHA</span>
          </div>
        </div>

        {/* Deals In Progress */}
        <div 
          onClick={() => onNavigate('deals')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiDealsInProgress}</span>
            <Handshake className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {activeDealsCount}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-amber-600 font-semibold">
            <span>Rs 7.5 Cr Volume</span>
          </div>
        </div>

        {/* Monthly Collection */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiMonthlyCollection}</span>
            <Receipt className="w-4 h-4 text-emerald-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
            {formatPKR(totalCollectedThisMonth, language)}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-emerald-600 font-semibold">
            <span>{collectionPercent}% of Target</span>
          </div>
        </div>

        {/* Overdue Installments */}
        <div 
          onClick={() => onNavigate('payments')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 hover:border-rose-500 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-rose-600 dark:text-rose-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiOverdueInstallments}</span>
            <AlertCircle className="w-4 h-4 text-rose-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-xl font-black text-rose-600 dark:text-rose-400 tabular-nums">
            {formatPKR(totalOverduePkr, language)}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-rose-600 font-semibold">
            <span>{overdueList.length} Clients Pending</span>
          </div>
        </div>

        {/* Available Properties */}
        <div 
          onClick={() => onNavigate('inventory')}
          className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer shadow-xs group"
        >
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">{t.kpiAvailableProperties}</span>
            <Building2 className="w-4 h-4 text-indigo-600 group-hover:scale-110 transition-transform" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
            {availablePropsCount}
          </div>
          <div className="mt-1 flex items-center text-[10px] text-slate-500 font-medium">
            <span>Plots, Villas & Flats</span>
          </div>
        </div>

      </div>

      {/* SVG Charts Row: Leads By Source & Collection vs Target */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leads By Source (Bar Chart) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.leadsBySource}</h3>
              <p className="text-[11px] text-slate-500">Peshawar Inbound Channels (Last 30 Days)</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              WhatsApp #1
            </span>
          </div>

          {/* Inline SVG Bar Visualization */}
          <div className="space-y-3 pt-2 text-xs">
            {[
              { source: 'WhatsApp Inquiries', count: 12, percent: 85, color: '#10B981' },
              { source: 'Walk-in / Showroom', count: 7, percent: 55, color: '#065F46' },
              { source: 'Referrals & Friends', count: 5, percent: 40, color: '#3B82F6' },
              { source: 'Facebook / Ads', count: 4, percent: 32, color: '#8B5CF6' },
              { source: 'Zameen.com / Portals', count: 3, percent: 25, color: '#F59E0B' },
            ].map((item, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-[11px]">
                  <span className="font-medium text-slate-700 dark:text-slate-300">{item.source}</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{item.count} leads</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{ width: `${item.percent}%`, backgroundColor: item.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Collection vs Target (Circular Gauge / Progress) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.collectionVsTarget}</h3>
              <p className="text-[11px] text-slate-500">November 2026 Target vs Actual</p>
            </div>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>

          <div className="flex flex-col items-center justify-center pt-2">
            {/* SVG Circular Progress Ring */}
            <div className="relative w-36 h-36 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-slate-100 dark:stroke-slate-800"
                  strokeWidth="10"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#059669"
                  strokeWidth="10"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * collectionPercent) / 100}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-2xl font-black text-slate-900 dark:text-slate-100 tabular-nums">
                  {collectionPercent}%
                </span>
                <p className="text-[10px] text-slate-400 font-medium">Achieved</p>
              </div>
            </div>

            <div className="w-full grid grid-cols-2 gap-4 mt-5 text-center text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Received</span>
                <p className="font-bold text-emerald-700 dark:text-emerald-400 text-sm mt-0.5">
                  {formatPKR(totalCollectedThisMonth, 'en')}
                </p>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase">Monthly Goal</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 text-sm mt-0.5">
                  {formatPKR(monthlyTarget, 'en')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Deals Funnel */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.dealsFunnel}</h3>
              <p className="text-[11px] text-slate-500">Pipeline Conversion Velocity</p>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              Active Stage
            </span>
          </div>

          <div className="space-y-2 pt-1 text-xs">
            {[
              { stage: 'Token Stage', count: '4 Deals', val: 'Rs 9.5 Lakh Token', width: '100%', bg: 'bg-emerald-600' },
              { stage: 'Sale Agreement Signed', count: '2 Deals', val: 'Rs 4.5 Cr Volume', width: '75%', bg: 'bg-emerald-700' },
              { stage: 'Installments Clearing', count: '3 Deals', val: 'Rs 5.2 Cr Pending', width: '55%', bg: 'bg-emerald-800' },
              { stage: 'Registry / Transfer', count: '1 Deal', val: 'PDA Transfer Slot', width: '35%', bg: 'bg-slate-800' },
            ].map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 space-y-1">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-bold text-slate-800 dark:text-slate-200">{f.stage}</span>
                  <span className="font-semibold text-emerald-600">{f.count}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${f.bg} rounded-full`} style={{ width: f.width }} />
                </div>
                <div className="text-[10px] text-slate-500">{f.val}</div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Actionable Bottom Panels: Today's Follow-ups + Overdue Payments Alert */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Today's Follow-ups (Checkable List) */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.todaysFollowUps}</h3>
              <p className="text-[11px] text-slate-500">Clients scheduled for call or visit today</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('leads')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
            >
              All Leads <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {leads.slice(0, 4).map((lead) => {
              const isDone = completedFollowUps.includes(lead.id);
              return (
                <div
                  key={lead.id}
                  className={`p-3 rounded-lg border transition-all flex items-start justify-between gap-3 ${
                    isDone
                      ? 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={isDone}
                      onChange={() => handleToggleFollowUp(lead.id)}
                      className="mt-1 h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div>
                      <p className={`font-semibold ${isDone ? 'line-through text-slate-400' : 'text-slate-900 dark:text-slate-100'}`}>
                        {lead.name}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        {lead.requirement} · {lead.location}
                      </p>
                      <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                        Budget: {formatPKR(lead.budgetPkr, language)} · Agent: {lead.agentName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <a
                      href={`https://wa.me/92${lead.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                      title="Chat on WhatsApp"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${lead.phone}`}
                      className="p-1.5 rounded-md text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Direct Call"
                    >
                      <PhoneCall className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Overdue Payments with One-Click Reminder */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>{t.overdueAlerts}</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </h3>
              <p className="text-[11px] text-slate-500">Installments past due date requiring follow-up</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
            >
              Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5 text-xs">
            {overdueList.map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg border border-rose-100 dark:border-rose-950/60 bg-rose-50/40 dark:bg-rose-950/20 flex items-center justify-between gap-3"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100">{item.clientName}</span>
                    <span className="text-[10px] font-semibold text-rose-600 bg-rose-100 dark:bg-rose-950 px-1.5 py-0.2 rounded">
                      Overdue since {item.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 truncate max-w-xs">
                    {item.property}
                  </p>
                  <p className="text-xs font-black text-rose-700 dark:text-rose-400 tabular-nums">
                    {formatPKR(item.amount, language)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onSendWhatsAppReminder(item.clientName, item.amount, item.dueDate)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold shrink-0 shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Send Reminder</span>
                </button>
              </div>
            ))}
          </div>

          {/* Quick Tip for Presenter */}
          <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg text-[11px] text-slate-600 dark:text-slate-300">
            <strong>Sales Pitch Tip:</strong> "Haji Sahab, dealer ka sab se bara masla installments ka hisaab hota hai. PropDesk mein click karte hi client ko polite reminder WhatsApp par chala jata hai."
          </div>
        </div>

      </div>

      {/* Agent Leaderboard & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Top Agents */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.agentLeaderboard}</h3>
              <p className="text-[11px] text-slate-500">Target Achievement & Deals Closed (Peshawar Branch)</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('team')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Manage Team
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {staff.filter(s => s.role !== 'accountant').map((member, i) => {
              const pct = member.monthlyTargetPkr > 0 ? Math.round((member.achievedPkr / member.monthlyTargetPkr) * 100) : 0;
              return (
                <div key={member.id} className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                        #{i + 1}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-slate-100">{member.name}</p>
                        <p className="text-[10px] text-slate-500 capitalize">{member.role} · {member.phone}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                        {formatPKR(member.achievedPkr, 'en')}
                      </span>
                      <p className="text-[10px] text-slate-500">Target: {formatPKR(member.monthlyTargetPkr, 'en')}</p>
                    </div>
                  </div>

                  <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${Math.min(pct, 100)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Dealer Activity Feed */}
        <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">{t.recentActivity}</h3>
              <p className="text-[11px] text-slate-500">Live system audit trail</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('payments')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              Full Log
            </button>
          </div>

          <div className="space-y-3 text-xs">
            {[
              { time: '10:14 AM', text: 'Rs 25 Lakh received from Engr. Kamran Shinwari (Regi Model Town)', badge: 'Payment' },
              { time: 'Yesterday', text: 'Zia-ur-Rehman Orakzai moved to Negotiation (Hayatabad 1 Kanal Villa)', badge: 'CRM' },
              { time: '04 Nov', text: 'Plot B-14 in DHA Peshawar Sector B booked by Haji Noor', badge: 'Booking' },
              { time: '02 Nov', text: 'Rental agreement renewed for Shop #14 Board Bazaar', badge: 'Rental' },
            ].map((act, i) => (
              <div key={i} className="flex items-start gap-2.5 pb-2.5 border-b border-slate-100 dark:border-slate-800/80 last:border-0 last:pb-0">
                <span className="text-[10px] font-mono text-slate-400 shrink-0 mt-0.5">{act.time}</span>
                <div className="space-y-0.5">
                  <p className="text-slate-700 dark:text-slate-300 leading-snug">{act.text}</p>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                    {act.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
