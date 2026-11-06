import React, { useState } from 'react';
import { X, Users2, Building2, UserCheck, Receipt, CheckSquare, CalendarDays } from 'lucide-react';
import { 
  Lead, 
  Property, 
  Client, 
  PaymentMethod, 
  Task, 
  SiteVisit,
  PropertyType,
  Language 
} from '../types';
import { translations } from '../utils/translations';

interface QuickAddModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLead: (lead: Lead) => void;
  onAddProperty: (property: Property) => void;
  onAddClient: (client: Client) => void;
  onRecordPayment: (payment: {
    clientName: string;
    propertyTitle: string;
    amountPkr: number;
    paymentMethod: PaymentMethod;
    referenceNumber: string;
    notes: string;
  }) => void;
  onAddTask: (task: Task) => void;
  onAddVisit: (visit: SiteVisit) => void;
  language: Language;
}

export const QuickAddModal: React.FC<QuickAddModalProps> = ({
  isOpen,
  onClose,
  onAddLead,
  onAddProperty,
  onAddClient,
  onRecordPayment,
  onAddTask,
  onAddVisit,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'lead' | 'property' | 'client' | 'payment' | 'task' | 'visit'>('lead');

  // Lead state
  const [leadName, setLeadName] = useState('');
  const [leadPhone, setLeadPhone] = useState('0300-');
  const [leadReq, setLeadReq] = useState('');
  const [leadLocation, setLeadLocation] = useState('Hayatabad Phase 3');
  const [leadBudget, setLeadBudget] = useState('15000000');
  const [leadSource, setLeadSource] = useState<'WhatsApp' | 'Walk-in' | 'Facebook' | 'Zameen' | 'Referral'>('WhatsApp');

  // Property state
  const [propTitle, setPropTitle] = useState('');
  const [propLocation, setPropLocation] = useState('DHA Peshawar');
  const [propType, setPropType] = useState<PropertyType>('plot');
  const [propSize, setPropSize] = useState('10');
  const [propPrice, setPropPrice] = useState('13000000');
  const [propPurpose, setPropPurpose] = useState<'sale' | 'rent'>('sale');

  // Client state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('0333-');
  const [clientCnic, setClientCnic] = useState('17301-');
  const [clientType, setClientType] = useState<'buyer' | 'seller' | 'investor' | 'tenant'>('buyer');

  // Payment state
  const [payClient, setPayClient] = useState('');
  const [payProp, setPayProp] = useState('');
  const [payAmount, setPayAmount] = useState('2000000');
  const [payMethod, setPayMethod] = useState<PaymentMethod>('Bank Transfer');
  const [payRef, setPayRef] = useState('HBL-TX-');

  // Task state
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDate, setTaskDate] = useState('2026-11-08');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('high');

  // Visit state
  const [visClient, setVisClient] = useState('');
  const [visProp, setVisProp] = useState('');
  const [visDate, setVisDate] = useState('2026-11-08');
  const [visTime, setVisTime] = useState('03:30 PM');

  if (!isOpen) return null;

  const handleLeadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadName) return;
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      name: leadName,
      phone: leadPhone,
      email: `${leadName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      requirement: leadReq || 'Residential Plot / House',
      propertyType: 'plot',
      location: leadLocation,
      budgetPkr: Number(leadBudget) || 10000000,
      source: leadSource,
      status: 'new',
      agentId: 'staff-1',
      agentName: 'Faiz Rehman',
      priority: 'hot',
      nextFollowUp: new Date().toISOString().split('T')[0],
      notes: 'Quick captured from top navigation menu',
      createdAt: new Date().toISOString().split('T')[0],
      timeline: [
        { date: new Date().toISOString().split('T')[0], action: 'Lead created via Quick-Add', user: 'Faiz Rehman' },
      ],
    };
    onAddLead(newLead);
    onClose();
  };

  const handlePropertySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propTitle) return;
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      title: propTitle,
      location: propLocation,
      society: propLocation.split(',')[0],
      type: propType,
      sizeMarla: Number(propSize) || 5,
      pricePkr: Number(propPrice) || 5000000,
      status: 'available',
      purpose: propPurpose,
      isPublished: true,
      agentId: 'staff-1',
      agentName: 'Faiz Rehman',
      ownerName: 'Owner On Record',
      ownerPhone: '0300-1234567',
      daysOnMarket: 1,
      features: ['Prime Location', 'Document Verified', 'Immediate Possession'],
      documents: [{ title: 'Allotment Certificate', verified: true, type: 'pdf' }],
    };
    onAddProperty(newProp);
    onClose();
  };

  const handleClientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;
    const newClient: Client = {
      id: `client-${Date.now()}`,
      name: clientName,
      phone: clientPhone,
      email: `${clientName.toLowerCase().replace(/\s+/g, '.')}@gmail.com`,
      cnicMasked: clientCnic.length > 5 ? `${clientCnic.slice(0, 5)}-XXXXXXX-${clientCnic.slice(-1) || '1'}` : '17301-XXXXXXX-1',
      type: clientType,
      kyc: { cnicVerified: true, photoVerified: false, sourceOfFundsVerified: false },
      linkedLeadsCount: 1,
      dealsCount: 0,
      totalVolumePkr: 0,
      notes: 'Added via Quick-Add menu',
      createdAt: new Date().toISOString().split('T')[0],
    };
    onAddClient(newClient);
    onClose();
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!payClient || !payAmount) return;
    onRecordPayment({
      clientName: payClient,
      propertyTitle: payProp || 'General Property Booking Token',
      amountPkr: Number(payAmount),
      paymentMethod: payMethod,
      referenceNumber: payRef,
      notes: 'Payment recorded via Quick Action modal',
    });
    onClose();
  };

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle) return;
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: taskTitle,
      dueDate: taskDate,
      priority: taskPriority,
      completed: false,
      assignee: 'Faiz Rehman',
    };
    onAddTask(newTask);
    onClose();
  };

  const handleVisitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visClient) return;
    const newVis: SiteVisit = {
      id: `vis-${Date.now()}`,
      clientName: visClient,
      clientPhone: '0300-0000000',
      propertyTitle: visProp || 'Site Visit Inspection',
      location: 'Peshawar',
      date: visDate,
      time: visTime,
      agentName: 'Faiz Rehman',
      status: 'scheduled',
      notes: 'Scheduled via Quick-Add',
    };
    onAddVisit(newVis);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
            Quick Add Record
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 px-3 overflow-x-auto text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('lead')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'lead' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            Lead
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('property')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'property' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            Property
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('payment')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'payment' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <Receipt className="w-3.5 h-3.5" />
            Payment
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('client')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'client' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Client
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('task')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'task' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            Task
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('visit')}
            className={`py-2.5 px-3 border-b-2 flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'visit' ? 'border-emerald-600 text-emerald-600 font-semibold' : 'border-transparent text-slate-500'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            Visit
          </button>
        </div>

        {/* Tab Forms */}
        <div className="p-5 overflow-y-auto text-xs">
          {activeTab === 'lead' && (
            <form onSubmit={handleLeadSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="e.g. Haji Asif Shinwari"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone (WhatsApp)</label>
                  <input
                    type="text"
                    required
                    value={leadPhone}
                    onChange={(e) => setLeadPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Source</label>
                  <select
                    value={leadSource}
                    onChange={(e) => setLeadSource(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Walk-in">Walk-in</option>
                    <option value="Facebook">Facebook Ad</option>
                    <option value="Zameen">Zameen.com</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Requirement</label>
                <input
                  type="text"
                  required
                  value={leadReq}
                  onChange={(e) => setLeadReq(e.target.value)}
                  placeholder="e.g. 5 Marla Plot or 10 Marla House"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Preferred Location</label>
                  <select
                    value={leadLocation}
                    onChange={(e) => setLeadLocation(e.target.value)}
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
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Budget (PKR)</label>
                  <input
                    type="number"
                    step="100000"
                    value={leadBudget}
                    onChange={(e) => setLeadBudget(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Save Lead to Pipeline
              </button>
            </form>
          )}

          {activeTab === 'property' && (
            <form onSubmit={handlePropertySubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Property Title</label>
                <input
                  type="text"
                  required
                  value={propTitle}
                  onChange={(e) => setPropTitle(e.target.value)}
                  placeholder="e.g. 10 Marla Brand New House with Lawn"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    required
                    value={propLocation}
                    onChange={(e) => setPropLocation(e.target.value)}
                    placeholder="e.g. Hayatabad Phase 4"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Type</label>
                  <select
                    value={propType}
                    onChange={(e) => setPropType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="plot">Plot</option>
                    <option value="house">House</option>
                    <option value="flat">Apartment / Flat</option>
                    <option value="shop">Shop</option>
                    <option value="commercial_plot">Commercial Plot</option>
                    <option value="rental">Rental Property</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Size (Marla)</label>
                  <input
                    type="number"
                    value={propSize}
                    onChange={(e) => setPropSize(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Demand Price (PKR)</label>
                  <input
                    type="number"
                    step="100000"
                    value={propPrice}
                    onChange={(e) => setPropPrice(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Add to Property Inventory
              </button>
            </form>
          )}

          {activeTab === 'payment' && (
            <form onSubmit={handlePaymentSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={payClient}
                  onChange={(e) => setPayClient(e.target.value)}
                  placeholder="e.g. Dr. Asadullah Durrani"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Property Description</label>
                <input
                  type="text"
                  value={payProp}
                  onChange={(e) => setPayProp(e.target.value)}
                  placeholder="e.g. 10 Marla House - Hayatabad Phase 4"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Amount (PKR)</label>
                  <input
                    type="number"
                    required
                    step="10000"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Payment Method</label>
                  <select
                    value={payMethod}
                    onChange={(e) => setPayMethod(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank Transfer">Bank Transfer</option>
                    <option value="Cheque">Cheque</option>
                    <option value="JazzCash">JazzCash</option>
                    <option value="Easypaisa">Easypaisa</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Ref / Cheque #</label>
                <input
                  type="text"
                  value={payRef}
                  onChange={(e) => setPayRef(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Record & Generate Receipt
              </button>
            </form>
          )}

          {activeTab === 'client' && (
            <form onSubmit={handleClientSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Client Full Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Haji Noor Muhammad"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    required
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Client Category</label>
                  <select
                    value={clientType}
                    onChange={(e) => setClientType(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="buyer">Buyer</option>
                    <option value="seller">Seller / Landlord</option>
                    <option value="investor">Overseas / Local Investor</option>
                    <option value="tenant">Tenant</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">CNIC Number</label>
                <input
                  type="text"
                  value={clientCnic}
                  onChange={(e) => setClientCnic(e.target.value)}
                  placeholder="17301-XXXXXXX-X"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Register Client in Directory
              </button>
            </form>
          )}

          {activeTab === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Task Title</label>
                <input
                  type="text"
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Collect Fard Malkiat copy from Patwari"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskDate}
                    onChange={(e) => setTaskDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Priority</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Create Task
              </button>
            </form>
          )}

          {activeTab === 'visit' && (
            <form onSubmit={handleVisitSubmit} className="space-y-3">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Client Name</label>
                <input
                  type="text"
                  required
                  value={visClient}
                  onChange={(e) => setVisClient(e.target.value)}
                  placeholder="e.g. Zia-ur-Rehman Orakzai"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Property to Inspect</label>
                <input
                  type="text"
                  value={visProp}
                  onChange={(e) => setVisProp(e.target.value)}
                  placeholder="e.g. 1 Kanal Villa - Hayatabad Phase 3"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Date</label>
                  <input
                    type="date"
                    value={visDate}
                    onChange={(e) => setVisDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-semibold mb-1">Time</label>
                  <input
                    type="text"
                    value={visTime}
                    onChange={(e) => setVisTime(e.target.value)}
                    placeholder="03:30 PM"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 mt-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
              >
                Schedule Site Visit
              </button>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
