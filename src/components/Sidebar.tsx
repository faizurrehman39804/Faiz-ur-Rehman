import React from 'react';
import {
  LayoutDashboard,
  Users2,
  Building2,
  MapPin,
  UserCheck,
  Handshake,
  Receipt,
  Percent,
  CalendarDays,
  CheckSquare,
  FolderLock,
  KeyRound,
  MessageSquare,
  Globe2,
  Smartphone,
  BarChart3,
  Users,
  Scale,
  Megaphone,
  Wallet,
  Settings,
  X
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../utils/translations';

export type ViewKey =
  | 'dashboard'
  | 'leads'
  | 'inventory'
  | 'societies'
  | 'clients'
  | 'deals'
  | 'payments'
  | 'commissions'
  | 'calendar'
  | 'tasks'
  | 'documents'
  | 'rentals'
  | 'whatsapp'
  | 'website'
  | 'client_portal'
  | 'reports'
  | 'team'
  | 'compliance'
  | 'marketing'
  | 'expenses'
  | 'settings';

interface SidebarProps {
  activeView: ViewKey;
  onSelectView: (view: ViewKey) => void;
  currentRole: UserRole;
  language: Language;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: ViewKey;
  labelEn: string;
  labelUr: string;
  icon: React.ComponentType<{ className?: string }>;
  allowedRoles: UserRole[];
  badge?: string;
}

interface NavGroup {
  groupEn: string;
  groupUr: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeView,
  onSelectView,
  currentRole,
  language,
  isOpenMobile,
  onCloseMobile,
}) => {
  const t = translations[language];

  const navGroups: NavGroup[] = [
    {
      groupEn: 'Core Operations',
      groupUr: 'بنیادی امور',
      items: [
        { id: 'dashboard', labelEn: 'Dashboard', labelUr: 'ڈیش بورڈ', icon: LayoutDashboard, allowedRoles: ['owner', 'manager', 'agent', 'accountant'] },
        { id: 'leads', labelEn: 'Leads (CRM)', labelUr: 'لیڈز (سی آر ایم)', icon: Users2, allowedRoles: ['owner', 'manager', 'agent'], badge: '10' },
        { id: 'inventory', labelEn: 'Property Inventory', labelUr: 'پراپرٹی انوینٹری', icon: Building2, allowedRoles: ['owner', 'manager', 'agent'] },
        { id: 'societies', labelEn: 'Societies & Plots', labelUr: 'سکیمز اور پلاٹس', icon: MapPin, allowedRoles: ['owner', 'manager', 'agent'] },
      ],
    },
    {
      groupEn: 'Deals & Financials',
      groupUr: 'ڈیلز اور مالیات',
      items: [
        { id: 'deals', labelEn: 'Deals & Bookings', labelUr: 'ڈیلز اور بکنگز', icon: Handshake, allowedRoles: ['owner', 'manager', 'agent'] },
        { id: 'payments', labelEn: 'Payments & Installments', labelUr: 'ادائیگیاں اور اقساط', icon: Receipt, allowedRoles: ['owner', 'manager', 'accountant'], badge: 'Due' },
        { id: 'commissions', labelEn: 'Commissions', labelUr: 'کمیشن کا حساب', icon: Percent, allowedRoles: ['owner', 'manager', 'accountant'] },
        { id: 'expenses', labelEn: 'Expenses & Accounts', labelUr: 'دفتر کے اخراجات', icon: Wallet, allowedRoles: ['owner', 'manager', 'accountant'] },
      ],
    },
    {
      groupEn: 'Clients & Property Care',
      groupUr: 'کسٹمرز اور پراپرٹی',
      items: [
        { id: 'clients', labelEn: 'Clients & KYC', labelUr: 'کلائنٹس اور کے وائی سی', icon: UserCheck, allowedRoles: ['owner', 'manager', 'agent', 'accountant'] },
        { id: 'rentals', labelEn: 'Rentals & Tenants', labelUr: 'کرائے دار اور رینٹل', icon: KeyRound, allowedRoles: ['owner', 'manager', 'agent'] },
        { id: 'documents', labelEn: 'Documents Vault', labelUr: 'دستاویزات والٹ', icon: FolderLock, allowedRoles: ['owner', 'manager', 'accountant'] },
      ],
    },
    {
      groupEn: 'Productivity & Comms',
      groupUr: 'روابط اور شیڈول',
      items: [
        { id: 'calendar', labelEn: 'Visits & Calendar', labelUr: 'سائٹ وزٹ و کیلنڈر', icon: CalendarDays, allowedRoles: ['owner', 'manager', 'agent'] },
        { id: 'tasks', labelEn: 'Tasks & Reminders', labelUr: 'ٹاسکس اور یاد دہانیاں', icon: CheckSquare, allowedRoles: ['owner', 'manager', 'agent', 'accountant'] },
        { id: 'whatsapp', labelEn: 'WhatsApp Center', labelUr: 'واٹس ایپ سنٹر', icon: MessageSquare, allowedRoles: ['owner', 'manager', 'agent'] },
      ],
    },
    {
      groupEn: 'Public & Growth Portals',
      groupUr: 'ویب سائٹ اور پورٹلز',
      items: [
        { id: 'website', labelEn: 'Website Builder Preview', labelUr: 'ویب سائٹ بلڈر پریویو', icon: Globe2, allowedRoles: ['owner', 'manager'] },
        { id: 'client_portal', labelEn: 'Client Portal Preview', labelUr: 'خریدار پورٹل پریویو', icon: Smartphone, allowedRoles: ['owner', 'manager', 'agent'] },
        { id: 'marketing', labelEn: 'Marketing & Poster', labelUr: 'مارکیٹنگ ٹولز', icon: Megaphone, allowedRoles: ['owner', 'manager', 'agent'] },
      ],
    },
    {
      groupEn: 'Management & Reports',
      groupUr: 'انتظامیہ اور رپورٹس',
      items: [
        { id: 'reports', labelEn: 'Reports & Analytics', labelUr: 'رپورٹس اور تجزیات', icon: BarChart3, allowedRoles: ['owner', 'manager', 'accountant'] },
        { id: 'team', labelEn: 'Team & Permissions', labelUr: 'ٹیم اور اختیارات', icon: Users, allowedRoles: ['owner'] },
        { id: 'compliance', labelEn: 'KP Compliance Center', labelUr: 'کے پی ریگولیشن', icon: Scale, allowedRoles: ['owner', 'manager'] },
        { id: 'settings', labelEn: 'Branding & Settings', labelUr: 'برانڈنگ و ترتیبات', icon: Settings, allowedRoles: ['owner'] },
      ],
    },
  ];

  const handleNavClick = (viewId: ViewKey) => {
    onSelectView(viewId);
    onCloseMobile();
  };

  const renderNavContent = () => (
    <div className="h-full flex flex-col justify-between py-4 overflow-y-auto">
      <div className="space-y-6 px-3">
        {navGroups.map((group, gIdx) => {
          const visibleItems = group.items.filter((item) =>
            item.allowedRoles.includes(currentRole)
          );

          if (visibleItems.length === 0) return null;

          return (
            <div key={gIdx} className="space-y-1">
              <h2 className="px-3 text-[11px] font-semibold tracking-wider uppercase text-slate-600 dark:text-slate-300">
                {language === 'ur' ? group.groupUr : group.groupEn}
              </h2>
              <div className="space-y-0.5">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeView === item.id;
                  const label = language === 'ur' ? item.labelUr : item.labelEn;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleNavClick(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                        isActive
                          ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-600 dark:text-slate-400'}`} />
                        <span className="truncate">{label}</span>
                      </div>
                      {item.badge && (
                        <span
                          className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                            isActive
                              ? 'bg-emerald-500 text-white'
                              : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Indicator Footer */}
      <div className="px-4 pt-4 mt-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <span className="truncate font-medium">AfnixByte · Peshawar</span>
          <span className="text-[10px] font-semibold text-emerald-800 dark:text-emerald-400">MVP v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (hidden on mobile) */}
      <aside aria-label="Desktop Navigation" className="hidden md:block w-64 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 sticky top-16 h-[calc(100vh-4rem)]">
        {renderNavContent()}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" 
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <nav aria-label="Mobile Navigation" className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col z-10">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-emerald-800 dark:text-emerald-400">
                {t.appName}
              </span>
              <button
                type="button"
                onClick={onCloseMobile}
                className="p-1 rounded text-slate-500 hover:text-slate-700 dark:text-slate-400"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              {renderNavContent()}
            </div>
          </nav>
        </div>
      )}
    </>
  );
};
