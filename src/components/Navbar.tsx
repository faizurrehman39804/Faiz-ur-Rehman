import React from 'react';
import { 
  Search, 
  Plus, 
  Moon, 
  Sun, 
  Globe, 
  HelpCircle, 
  Sparkles, 
  ShieldCheck, 
  ChevronDown, 
  Bell,
  Menu
} from 'lucide-react';
import { UserRole, Language } from '../types';
import { translations } from '../utils/translations';

interface NavbarProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  language: Language;
  onLanguageToggle: () => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
  onOpenCommandPalette: () => void;
  onOpenQuickAdd: () => void;
  onOpenMeetingGuide: () => void;
  onOpenWishlist: () => void;
  wishlistCount: number;
  onToggleMobileSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  language,
  onLanguageToggle,
  darkMode,
  onDarkModeToggle,
  onOpenCommandPalette,
  onOpenQuickAdd,
  onOpenMeetingGuide,
  onOpenWishlist,
  wishlistCount,
  onToggleMobileSidebar,
}) => {
  const t = translations[language];

  const roleLabels: Record<UserRole, { en: string; ur: string }> = {
    owner: { en: 'Owner (All Access)', ur: 'مالک (مکمل رسائی)' },
    manager: { en: 'Manager (Sales & Ops)', ur: 'مینیجر (سیلز و آپریشنز)' },
    agent: { en: 'Agent (Leads & Visits)', ur: 'ایجنٹ (لیڈز اور وزٹس)' },
    accountant: { en: 'Accountant (Ledgers)', ur: 'اکاؤنٹنٹ (کھاتہ)' },
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Zone 1: Mobile Hamburger + Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            type="button"
            onClick={onToggleMobileSidebar}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-emerald-800 dark:text-emerald-400 whitespace-nowrap">
              {t.appName}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium px-2 py-0.5 rounded text-emerald-700 bg-emerald-50 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 whitespace-nowrap">
              {language === 'ur' ? 'پشاور ڈیمو' : 'Peshawar MVP'}
            </span>
          </div>
        </div>

        {/* Zone 2: Search Ctrl+K & Meeting Helpers & Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-1 justify-end md:justify-center max-w-2xl">
          
          {/* Global Search Bar (Ctrl+K) */}
          <button
            type="button"
            onClick={onOpenCommandPalette}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 w-48 md:w-64 text-left text-xs text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200/80 dark:hover:bg-slate-700/80 rounded-lg border border-slate-200/70 dark:border-slate-700/60 transition-colors"
          >
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{t.searchPlaceholder}</span>
            <kbd className="hidden lg:inline-block ml-auto text-[10px] bg-white dark:bg-slate-900 px-1.5 py-0.5 rounded text-slate-400 border border-slate-200 dark:border-slate-700">⌘K</kbd>
          </button>

          {/* Role Switcher Dropdown */}
          <div className="relative group shrink-0">
            <label htmlFor="role-select" className="sr-only">Select User Role</label>
            <div className="flex items-center gap-1 px-2 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 cursor-pointer max-w-[110px] sm:max-w-none">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <select
                id="role-select"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-transparent border-none text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none cursor-pointer truncate"
              >
                <option value="owner" className="bg-white dark:bg-slate-900">{roleLabels.owner[language]}</option>
                <option value="manager" className="bg-white dark:bg-slate-900">{roleLabels.manager[language]}</option>
                <option value="agent" className="bg-white dark:bg-slate-900">{roleLabels.agent[language]}</option>
                <option value="accountant" className="bg-white dark:bg-slate-900">{roleLabels.accountant[language]}</option>
              </select>
            </div>
          </div>

          {/* Sales Meeting Guide button */}
          <button
            type="button"
            onClick={onOpenMeetingGuide}
            title="10-Minute Dealer Demo Script & Discovery Questions"
            className="flex items-center gap-1.5 p-1.5 sm:px-2.5 sm:py-1.5 text-xs font-medium text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 hover:bg-amber-100 dark:hover:bg-amber-900/60 rounded-lg border border-amber-200 dark:border-amber-800/60 transition-colors shrink-0"
          >
            <HelpCircle className="w-4 h-4 sm:w-3.5 sm:h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="hidden lg:inline">{t.salesMeetingGuide}</span>
          </button>

          {/* Language Switcher */}
          <button
            type="button"
            onClick={onLanguageToggle}
            className="px-2 py-1.5 text-[11px] sm:text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-700 transition-colors whitespace-nowrap shrink-0"
            title="Switch Language / زبان تبدیل کریں"
          >
            {language === 'en' ? 'اردو' : 'EN'}
          </button>

          {/* Dark Mode Switcher */}
          <button
            type="button"
            onClick={onDarkModeToggle}
            className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
            aria-label="Toggle theme"
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>
        </div>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenQuickAdd}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm transition-all whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t.quickAdd}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
