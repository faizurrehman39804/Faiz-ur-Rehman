import React, { useState } from 'react';
import { 
  MessageSquare, 
  Send, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Users, 
  Smartphone,
  CheckCircle2
} from 'lucide-react';
import { Language, DealerSettings } from '../../types';
import { translations } from '../../utils/translations';

interface WhatsAppCenterViewProps {
  settings: DealerSettings;
  language: Language;
}

export const WhatsAppCenterView: React.FC<WhatsAppCenterViewProps> = ({
  settings,
  language,
}) => {
  const t = translations[language];

  const [activeTemplateIdx, setActiveTemplateIdx] = useState(0);
  const [copied, setCopied] = useState(false);
  const [recipientPhone, setRecipientPhone] = useState('0300-5921840');
  const [clientName, setClientName] = useState('Haji Noor Muhammad');
  const [propertyTitle, setPropertyTitle] = useState('10 Marla Plot - DHA Peshawar Sector B');
  const [amountDue, setAmountDue] = useState('25 Lakh');
  const [dueDate, setDueDate] = useState('15 November 2026');

  const templates = [
    {
      titleEn: '1. Overdue Installment Reminder',
      titleUr: 'بقایا قسط کی یاد دہانی',
      type: 'payment',
      textEn: `Assalam-o-Alaikum {client_name} Sahib,\n\nWe hope this message finds you well. This is a gentle reminder from ${settings.dealerName} regarding the upcoming/overdue installment of *Rs {amount_due}* against your property: *{property_title}*.\n\n*Due Date:* {due_date}\n\nPlease share the payment slip once deposited in the official dealership account or visit our office at ${settings.address}.\n\nJazakAllah Khair,\nAccounts Desk - ${settings.dealerName}\nPhone: ${settings.phone}`,
      textUr: `السلام علیکم {client_name} صاحب،\n\nامید ہے آپ خیریت سے ہوں گے۔ یہ ایک یاد دہانی ہے ${settings.dealerName} کی جانب سے آپ کی جائیداد: *{property_title}* کی واجب الادا قسط برائے رقم *{amount_due}*۔\n\n*آخری تاریخ:* {due_date}\n\nبرائے مہربانی قسط جمع کروا کر رسید شیئر فرمائیں یا دفتر تشریف لائیں: ${settings.address}۔\n\nشکریہ،\nاکاؤنٹس ڈیپارٹمنٹ - ${settings.dealerName}\nرابطہ: ${settings.phone}`,
    },
    {
      titleEn: '2. New Inbound Inquiry Greeting',
      titleUr: 'نئے گاہک کا خیر مقدم',
      type: 'crm',
      textEn: `Assalam-o-Alaikum {client_name} Sahib,\n\nThank you for reaching out to *${settings.dealerName}*, Peshawar's premier real estate consultancy.\n\nWe have received your inquiry regarding *{property_title}*. Our senior property consultant will share verified PDA/DHA inventory options matching your exact budget and location preference shortly.\n\nOffice Address: ${settings.address}\nDirect WhatsApp: ${settings.phone}`,
      textUr: `السلام علیکم {client_name} صاحب،\n\n*${settings.dealerName}* پشاور سے رابطہ کرنے کا بہت شکریہ۔ ہمیں *{property_title}* کے بارے میں آپ کی انکوائری موصول ہوئی ہے۔ ہمارے سینئر کنسلٹنٹ آپ کی ڈیمانڈ اور بجٹ کے مطابق بہترین آپشنز جلد شیئر کریں گے۔\n\nدفتر کا پتہ: ${settings.address}\nرابطہ نمبر: ${settings.phone}`,
    },
    {
      titleEn: '3. Site Visit Confirmation',
      titleUr: 'سائٹ وزٹ کی تصدیق',
      type: 'visit',
      textEn: `Assalam-o-Alaikum {client_name} Sahib,\n\nYour property site inspection has been confirmed:\n\n📍 Property: *{property_title}*\n📅 Inspection Date: *{due_date}*\n🚗 Assigned Agent: Tariq Bangash (${settings.phone})\n\nOur agent will receive you at the site or our office 15 minutes prior. Please let us know if you need location pin on Google Maps.\n\nRegards,\n${settings.dealerName}`,
      textUr: `السلام علیکم {client_name} صاحب،\n\nآپ کا پراپرٹی معائنہ وزٹ کنفرم ہو چکا ہے:\n\n📍 پراپرٹی: *{property_title}*\n📅 تاریخ: *{due_date}*\n🚗 ایجنٹ کا نام: طارق بنگش (${settings.phone})\n\nہمارے نمائندے وقت پر آپ کے استقبال کے لیے موجود ہوں گے۔\n\nشکریہ،\n${settings.dealerName}`,
    },
    {
      titleEn: '4. Token / Bayana Booking Confirmation',
      titleUr: 'ٹوکن بیعانہ کنفرمیشن',
      type: 'deal',
      textEn: `Mubarak Ho {client_name} Sahib!\n\nToken Bayana of *Rs {amount_due}* has been successfully received and recorded against: *{property_title}*.\n\nComputerized official receipt has been issued and property status changed to BOOKED.\n\nAgreement signing date: {due_date}.\n\nWarm Regards,\n${settings.dealerName} Peshawar`,
      textUr: `مبارک ہو {client_name} صاحب!\n\nآپ کا ٹوکن بیعانہ رقم *{amount_due}* موصول ہو کر جائیداد: *{property_title}* پر بکنگ مکمل ہو چکی ہے۔\n\nکمپیوٹرائزڈ رسید جاری کر دی گئی ہے۔ معاہدہ بیع کی تاریخ: {due_date}۔\n\nنیک تمناؤں کے ساتھ،\n${settings.dealerName} پشاور`,
    },
  ];

  const currentTemplate = templates[activeTemplateIdx];
  const templateRaw = language === 'ur' ? currentTemplate.textUr : currentTemplate.textEn;

  // Replace variable placeholders
  const compiledMessage = templateRaw
    .replace(/{client_name}/g, clientName)
    .replace(/{property_title}/g, propertyTitle)
    .replace(/{amount_due}/g, amountDue)
    .replace(/{due_date}/g, dueDate);

  const handleCopy = () => {
    navigator.clipboard.writeText(compiledMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const cleanPhone = recipientPhone.replace(/[^0-9]/g, '');
    const formatted = cleanPhone.startsWith('92') ? cleanPhone : `92${cleanPhone.slice(-10)}`;
    const url = `https://wa.me/${formatted}?text=${encodeURIComponent(compiledMessage)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            <span>{t.navWhatsApp}</span>
          </h2>
          <p className="text-xs text-slate-500">
            Automated WhatsApp communication center for Peshawar property inquiries & installment reminders
          </p>
        </div>

        <div className="p-2 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-800 dark:text-emerald-300 text-[11px] font-medium flex items-center gap-2">
          <Smartphone className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Note: Full production version links with WhatsApp Business API</span>
        </div>
      </div>

      {/* Main 2-Column Interface: Templates & Live Phone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Templates & Variables (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Select Message Template
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {templates.map((tpl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveTemplateIdx(idx)}
                  className={`p-3 rounded-lg text-left border text-xs font-semibold transition-all ${
                    activeTemplateIdx === idx
                      ? 'border-emerald-600 bg-emerald-50/60 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 ring-1 ring-emerald-600'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                  }`}
                >
                  {language === 'ur' ? tpl.titleUr : tpl.titleEn}
                </button>
              ))}
            </div>
          </div>

          {/* Dynamic Fill Variables */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Live Variables Replacement
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Client Name</label>
                <input
                  type="text"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Recipient Phone</label>
                <input
                  type="text"
                  value={recipientPhone}
                  onChange={(e) => setRecipientPhone(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Property Description</label>
                <input
                  type="text"
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>

              <div>
                <label className="block text-slate-600 dark:text-slate-400 mb-1">Amount Due / Token</label>
                <input
                  type="text"
                  value={amountDue}
                  onChange={(e) => setAmountDue(e.target.value)}
                  className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100"
                />
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied Text!' : 'Copy Template'}</span>
            </button>

            <button
              type="button"
              onClick={handleOpenWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors"
            >
              <Send className="w-4 h-4" />
              <span>Launch in WhatsApp (wa.me)</span>
            </button>
          </div>

        </div>

        {/* Live Smartphone Screen Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          <div className="w-full max-w-sm rounded-[32px] border-[6px] border-slate-800 dark:border-slate-700 bg-slate-900 p-2 shadow-2xl">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-slate-800 rounded-full mx-auto mb-2" />

            {/* WhatsApp App Mock Header */}
            <div className="bg-emerald-800 text-white px-3 py-2 rounded-t-2xl flex items-center gap-2 text-xs">
              <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center font-bold">
                {clientName[0] || 'C'}
              </div>
              <div className="leading-tight">
                <p className="font-bold">{clientName}</p>
                <p className="text-[10px] text-emerald-200">Online</p>
              </div>
            </div>

            {/* Chat Canvas */}
            <div className="bg-[#EFEAE2] dark:bg-slate-950 p-4 min-h-[320px] rounded-b-2xl flex flex-col justify-end text-xs">
              {/* Message Bubble */}
              <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl rounded-tr-none shadow-xs border border-slate-200/60 dark:border-slate-800 space-y-1 text-slate-800 dark:text-slate-100 whitespace-pre-line leading-relaxed text-[11px]">
                {compiledMessage}
                <div className="text-right text-[9px] text-slate-400 mt-1">
                  10:18 AM · Read
                </div>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
