import React, { useState, useEffect } from 'react';
import { 
  UserRole, 
  Language, 
  Lead, 
  Property, 
  Society, 
  Client, 
  Deal, 
  InstallmentPlan, 
  Receipt, 
  AuditLogItem, 
  RentalLease, 
  Task, 
  SiteVisit, 
  ExpenseItem, 
  StaffMember, 
  DealerSettings, 
  WishlistItem,
  PaymentMethod,
  PropertyStatus,
  LeadStatus,
  DealStage
} from './types';
import { 
  initialDealerSettings, 
  initialStaff, 
  initialClients, 
  initialLeads, 
  initialProperties, 
  initialSocieties, 
  initialDeals, 
  initialInstallmentPlans, 
  initialReceipts, 
  initialAuditLogs, 
  initialRentals, 
  initialTasks, 
  initialSiteVisits, 
  initialExpenses, 
  initialWishlist 
} from './data/mockData';
import { Navbar } from './components/Navbar';
import { Sidebar, ViewKey } from './components/Sidebar';
import { CommandPalette } from './components/CommandPalette';
import { QuickAddModal } from './components/QuickAddModal';
import { WishlistDrawer } from './components/WishlistDrawer';
import { MeetingGuideModal } from './components/MeetingGuideModal';
import { ReceiptModal } from './components/ReceiptModal';
import { OnboardingTour } from './components/OnboardingTour';

// Views
import { DashboardView } from './components/views/DashboardView';
import { LeadsView } from './components/views/LeadsView';
import { InventoryView } from './components/views/InventoryView';
import { SocietiesView } from './components/views/SocietiesView';
import { ClientsView } from './components/views/ClientsView';
import { DealsView } from './components/views/DealsView';
import { PaymentsView } from './components/views/PaymentsView';
import { CommissionsView } from './components/views/CommissionsView';
import { RentalsView } from './components/views/RentalsView';
import { CalendarView } from './components/views/CalendarView';
import { TasksView } from './components/views/TasksView';
import { DocumentsView } from './components/views/DocumentsView';
import { WhatsAppCenterView } from './components/views/WhatsAppCenterView';
import { WebsiteBuilderView } from './components/views/WebsiteBuilderView';
import { ClientPortalView } from './components/views/ClientPortalView';
import { ReportsView } from './components/views/ReportsView';
import { TeamView } from './components/views/TeamView';
import { ComplianceView } from './components/views/ComplianceView';
import { MarketingView } from './components/views/MarketingView';
import { ExpensesView } from './components/views/ExpensesView';
import { SettingsView } from './components/views/SettingsView';
import { numberToWordsPKR, formatPKR } from './utils/formatters';

export default function App() {
  // Global States
  const [activeView, setActiveView] = useState<ViewKey>('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('owner');
  const [language, setLanguage] = useState<Language>('en');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [isOpenMobileSidebar, setIsOpenMobileSidebar] = useState<boolean>(false);

  // App Data States
  const [settings, setSettings] = useState<DealerSettings>(initialDealerSettings);
  const [staff, setStaff] = useState<StaffMember[]>(initialStaff);
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [properties, setProperties] = useState<Property[]>(initialProperties);
  const [societies, setSocieties] = useState<Society[]>(initialSocieties);
  const [deals, setDeals] = useState<Deal[]>(initialDeals);
  const [installmentPlans, setInstallmentPlans] = useState<InstallmentPlan[]>(initialInstallmentPlans);
  const [receipts, setReceipts] = useState<Receipt[]>(initialReceipts);
  const [auditLogs, setAuditLogs] = useState<AuditLogItem[]>(initialAuditLogs);
  const [rentals, setRentals] = useState<RentalLease[]>(initialRentals);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [siteVisits, setSiteVisits] = useState<SiteVisit[]>(initialSiteVisits);
  const [expenses, setExpenses] = useState<ExpenseItem[]>(initialExpenses);
  const [wishlist, setWishlist] = useState<WishlistItem[]>(initialWishlist);

  // Modals & Panels
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [isMeetingGuideOpen, setIsMeetingGuideOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOnboardingTourOpen, setIsOnboardingTourOpen] = useState(false);
  const [activeReceiptModal, setActiveReceiptModal] = useState<Receipt | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Synchronize RTL layout with language
  useEffect(() => {
    document.documentElement.setAttribute('dir', language === 'ur' ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  // Synchronize dark mode class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Keyboard shortcut Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    const names = {
      owner: 'Principal Dealer (Owner)',
      manager: 'General Manager',
      agent: 'Sales Agent',
      accountant: 'Accountant & Cashier',
    };
    showToast(`Switched view to: ${names[newRole]}`);
  };

  const handleLanguageToggle = () => {
    const nextLang = language === 'en' ? 'ur' : 'en';
    setLanguage(nextLang);
    showToast(nextLang === 'ur' ? 'زبان اردو میں تبدیل ہو گئی' : 'Switched to English interface');
  };

  const handleRecordPayment = (data: {
    clientName: string;
    propertyTitle: string;
    amountPkr: number;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    notes: string;
  }) => {
    const newReceiptNo = `REC-2026-0${receipts.length + 70}`;
    const newReceipt: Receipt = {
      id: `rec-${Date.now()}`,
      receiptNumber: newReceiptNo,
      date: new Date().toISOString().split('T')[0],
      clientName: data.clientName,
      clientCnic: '17301-4729184-1',
      propertyTitle: data.propertyTitle,
      amountPkr: data.amountPkr,
      amountInWords: numberToWordsPKR(data.amountPkr),
      paymentMethod: data.paymentMethod,
      referenceNumber: data.referenceNumber,
      receivedBy: 'Faiz Rehman',
      notes: data.notes,
    };

    setReceipts([newReceipt, ...receipts]);

    // Record in Audit Trail
    const newAudit: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Faiz Rehman (Owner)',
      action: 'Payment Recorded',
      details: `Received ${formatPKR(data.amountPkr, 'en')} from ${data.clientName} (${data.paymentMethod} - Ref: ${data.referenceNumber})`,
    };
    setAuditLogs([newAudit, ...auditLogs]);

    showToast(`Payment of ${formatPKR(data.amountPkr, language)} recorded!`);
    setActiveReceiptModal(newReceipt);
  };

  const handleVoidPayment = (receiptId: string, reason: string) => {
    const target = receipts.find(r => r.id === receiptId);
    if (!target) return;

    const newAudit: AuditLogItem = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      user: 'Faiz Rehman (Owner)',
      action: 'Payment Voided',
      details: `Voided Receipt #${target.receiptNumber} (${formatPKR(target.amountPkr, 'en')})`,
      isVoided: true,
      voidReason: reason,
    };

    setAuditLogs([newAudit, ...auditLogs]);
    showToast(`Receipt #${target.receiptNumber} voided and recorded in audit log.`);
  };

  const handleAddLead = (lead: Lead) => {
    setLeads([lead, ...leads]);
    showToast(`Lead '${lead.name}' added to CRM pipeline!`);
  };

  const handleUpdateLeadStatus = (leadId: string, newStatus: LeadStatus) => {
    setLeads(leads.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
    showToast('Lead stage updated successfully');
  };

  const handleConvertToDeal = (lead: Lead) => {
    const newDeal: Deal = {
      id: `deal-${Date.now()}`,
      dealNumber: `PD-DEAL-2026-0${deals.length + 85}`,
      propertyId: 'prop-1',
      propertyTitle: lead.requirement,
      buyerName: lead.name,
      buyerPhone: lead.phone,
      sellerName: 'Property Seller on File',
      sellerPhone: '0300-1122334',
      agreedPricePkr: lead.budgetPkr,
      tokenPkr: Math.round(lead.budgetPkr * 0.05),
      stage: 'token',
      agentName: lead.agentName,
      commissionPkr: Math.round(lead.budgetPkr * 0.02),
      commissionSplit: { agentPercent: 50, companyPercent: 50 },
      commissionStatus: 'pending',
      date: new Date().toISOString().split('T')[0],
    };
    setDeals([newDeal, ...deals]);
    handleUpdateLeadStatus(lead.id, 'closed_won');
    showToast(`Lead converted to active Deal #${newDeal.dealNumber}!`);
  };

  const handleAddProperty = (property: Property) => {
    setProperties([property, ...properties]);
    showToast(`Property '${property.title}' added to inventory!`);
  };

  const handleUpdatePropertyStatus = (id: string, status: PropertyStatus) => {
    setProperties(properties.map(p => p.id === id ? { ...p, status } : p));
    showToast(`Property status updated to ${status.toUpperCase()}`);
  };

  const handleTogglePublish = (id: string) => {
    setProperties(properties.map(p => p.id === id ? { ...p, isPublished: !p.isPublished } : p));
    showToast('Website publication status toggled');
  };

  const handleBookPlot = (plotId: string, clientName: string, token: number) => {
    setSocieties(societies.map(soc => ({
      ...soc,
      blocks: soc.blocks.map(b => ({
        ...b,
        plots: b.plots.map(p => p.id === plotId ? { ...p, status: 'booked', bookedBy: clientName } : p),
      })),
    })));
    showToast(`Plot booked for ${clientName} with Token ${formatPKR(token, language)}`);
  };

  const handleAddWishlistItem = (item: Omit<WishlistItem, 'id' | 'timestamp'>) => {
    const newItem: WishlistItem = {
      id: `wish-${Date.now()}`,
      ...item,
      timestamp: new Date().toISOString().split('T')[0],
    };
    setWishlist([newItem, ...wishlist]);
    showToast('Recorded in Dealer Wishlist!');
  };

  const handleDeleteWishlistItem = (id: string) => {
    setWishlist(wishlist.filter(w => w.id !== id));
  };

  const handleResetDemoData = () => {
    setSettings(initialDealerSettings);
    setStaff(initialStaff);
    setClients(initialClients);
    setLeads(initialLeads);
    setProperties(initialProperties);
    setSocieties(initialSocieties);
    setDeals(initialDeals);
    setInstallmentPlans(initialInstallmentPlans);
    setReceipts(initialReceipts);
    setAuditLogs(initialAuditLogs);
    setRentals(initialRentals);
    setTasks(initialTasks);
    setSiteVisits(initialSiteVisits);
    setExpenses(initialExpenses);
    setWishlist(initialWishlist);
    showToast('Demo data restored to initial Peshawar seed records.');
  };

  const handleSendWhatsAppReminder = (clientName: string, amount: number, dueDate: string) => {
    const msg = encodeURIComponent(
      `Assalam-o-Alaikum ${clientName} Sahib,\n\nGentle reminder from ${settings.dealerName} regarding the pending installment of ${formatPKR(amount, 'en')} due on ${dueDate}.\n\nPlease share the deposit slip once paid. Thank you.\n\nAccounts Desk - ${settings.phone}`
    );
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    showToast(`Reminder template prepared for ${clientName}`);
  };

  // Render view router
  const renderView = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView
            leads={leads}
            properties={properties}
            deals={deals}
            installmentPlans={installmentPlans}
            visits={siteVisits}
            staff={staff}
            settings={settings}
            language={language}
            currentRole={currentRole}
            onNavigate={(v) => setActiveView(v)}
            onQuickAdd={() => setIsQuickAddOpen(true)}
            onSendWhatsAppReminder={handleSendWhatsAppReminder}
          />
        );
      case 'leads':
        return (
          <LeadsView
            leads={leads}
            properties={properties}
            onUpdateLeadStatus={handleUpdateLeadStatus}
            onAddLead={handleAddLead}
            onConvertToDeal={handleConvertToDeal}
            language={language}
          />
        );
      case 'inventory':
        return (
          <InventoryView
            properties={properties}
            onAddProperty={handleAddProperty}
            onUpdatePropertyStatus={handleUpdatePropertyStatus}
            onTogglePublish={handleTogglePublish}
            currentRole={currentRole}
            language={language}
          />
        );
      case 'societies':
        return (
          <SocietiesView
            societies={societies}
            onBookPlot={handleBookPlot}
            language={language}
          />
        );
      case 'clients':
        return (
          <ClientsView
            clients={clients}
            onAddClient={(c) => {
              setClients([c, ...clients]);
              showToast(`Client '${c.name}' added to directory!`);
            }}
            onUpdateKyc={(id, kyc) => {
              setClients(clients.map(c => c.id === id ? { ...c, kyc } : c));
              showToast('Client KYC checklist updated!');
            }}
            language={language}
          />
        );
      case 'deals':
        return (
          <DealsView
            deals={deals}
            onUpdateDealStage={(id, stage) => {
              setDeals(deals.map(d => d.id === id ? { ...d, stage } : d));
              showToast(`Deal advanced to ${stage.toUpperCase()}`);
            }}
            language={language}
          />
        );
      case 'payments':
        return (
          <PaymentsView
            plans={installmentPlans}
            receipts={receipts}
            auditLogs={auditLogs}
            settings={settings}
            onRecordPayment={handleRecordPayment}
            onVoidPayment={handleVoidPayment}
            onOpenReceipt={(r) => setActiveReceiptModal(r)}
            onSendReminder={handleSendWhatsAppReminder}
            currentRole={currentRole}
            language={language}
          />
        );
      case 'commissions':
        return (
          <CommissionsView
            deals={deals}
            staff={staff}
            language={language}
          />
        );
      case 'rentals':
        return (
          <RentalsView
            rentals={rentals}
            onRentReceived={(id) => {
              showToast('Monthly rent marked as cleared in ledger!');
            }}
            language={language}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            visits={siteVisits}
            onAddVisit={(v) => {
              setSiteVisits([v, ...siteVisits]);
              showToast('Site visit scheduled successfully!');
            }}
            language={language}
          />
        );
      case 'tasks':
        return (
          <TasksView
            tasks={tasks}
            onAddTask={(t) => {
              setTasks([t, ...tasks]);
              showToast('Task added to schedule!');
            }}
            onToggleTask={(id) => {
              setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
            }}
            language={language}
          />
        );
      case 'documents':
        return <DocumentsView language={language} />;
      case 'whatsapp':
        return <WhatsAppCenterView settings={settings} language={language} />;
      case 'website':
        return (
          <WebsiteBuilderView
            properties={properties}
            settings={settings}
            onUpdateSettings={(s) => setSettings({ ...settings, ...s })}
            onTogglePublish={handleTogglePublish}
            language={language}
          />
        );
      case 'client_portal':
        return (
          <ClientPortalView
            plan={installmentPlans[0]}
            receipts={receipts}
            settings={settings}
            onOpenReceipt={(r) => setActiveReceiptModal(r)}
            language={language}
          />
        );
      case 'reports':
        return <ReportsView language={language} />;
      case 'team':
        return (
          <TeamView
            staff={staff}
            onAddStaff={(m) => {
              setStaff([...staff, m]);
              showToast(`Staff member '${m.name}' added!`);
            }}
            language={language}
          />
        );
      case 'compliance':
        return <ComplianceView clients={clients} language={language} />;
      case 'marketing':
        return <MarketingView properties={properties} settings={settings} language={language} />;
      case 'expenses':
        return (
          <ExpensesView
            expenses={expenses}
            onAddExpense={(e) => {
              setExpenses([e, ...expenses]);
              showToast('Expense entry recorded in petty cash ledger');
            }}
            language={language}
          />
        );
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            onUpdateSettings={(s) => {
              setSettings({ ...settings, ...s });
              showToast('Settings saved!');
            }}
            onResetDemoData={handleResetDemoData}
            language={language}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Top Navbar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        language={language}
        onLanguageToggle={handleLanguageToggle}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
        onOpenQuickAdd={() => setIsQuickAddOpen(true)}
        onOpenMeetingGuide={() => setIsMeetingGuideOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        wishlistCount={wishlist.length}
        onToggleMobileSidebar={() => setIsOpenMobileSidebar(!isOpenMobileSidebar)}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Nav */}
        <Sidebar
          activeView={activeView}
          onSelectView={(v) => setActiveView(v)}
          currentRole={currentRole}
          language={language}
          isOpenMobile={isOpenMobileSidebar}
          onCloseMobile={() => setIsOpenMobileSidebar(false)}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderView()}
        </main>
      </div>

      {/* Global Modals & Dialogs */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onNavigate={(v) => setActiveView(v)}
        leads={leads}
        properties={properties}
        clients={clients}
        language={language}
      />

      <QuickAddModal
        isOpen={isQuickAddOpen}
        onClose={() => setIsQuickAddOpen(false)}
        onAddLead={handleAddLead}
        onAddProperty={handleAddProperty}
        onAddClient={(c) => setClients([c, ...clients])}
        onRecordPayment={handleRecordPayment}
        onAddTask={(t) => setTasks([t, ...tasks])}
        onAddVisit={(v) => setSiteVisits([v, ...siteVisits])}
        language={language}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlist}
        onAddItem={handleAddWishlistItem}
        onDeleteItem={handleDeleteWishlistItem}
        language={language}
      />

      <MeetingGuideModal
        isOpen={isMeetingGuideOpen}
        onClose={() => setIsMeetingGuideOpen(false)}
        language={language}
      />

      <ReceiptModal
        isOpen={Boolean(activeReceiptModal)}
        onClose={() => setActiveReceiptModal(null)}
        receipt={activeReceiptModal}
        settings={settings}
        language={language}
      />

      <OnboardingTour
        isOpen={isOnboardingTourOpen}
        onClose={() => setIsOnboardingTourOpen(false)}
        language={language}
      />

      {/* Floating Action Button for Sales Wishlist */}
      <button
        type="button"
        onClick={() => setIsWishlistOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg border border-slate-700 text-xs font-bold transition-transform hover:scale-105 active:scale-95"
        title="Record dealer request during sales meeting"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
        <span>Wishlist ({wishlist.length})</span>
      </button>

      {/* Global Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl shadow-2xl border border-slate-700 text-xs font-semibold animate-in fade-in slide-in-from-bottom-3 duration-200">
          {toastMessage}
        </div>
      )}

    </div>
  );
}
