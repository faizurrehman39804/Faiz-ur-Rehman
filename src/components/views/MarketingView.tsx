import React, { useState } from 'react';
import { Megaphone, Sparkles, Copy, Check, Share2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { Property, DealerSettings, Language } from '../../types';
import { formatPKR, formatArea } from '../../utils/formatters';

interface MarketingViewProps {
  properties: Property[];
  settings: DealerSettings;
  language: Language;
}

export const MarketingView: React.FC<MarketingViewProps> = ({
  properties,
  settings,
  language,
}) => {
  const [selectedPropId, setSelectedPropId] = useState(properties[0]?.id || '');
  const [langChoice, setLangChoice] = useState<'ur' | 'en'>('ur');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);

  // Google Business Profile Checklist State
  const [gbpTasks, setGbpTasks] = useState([
    { id: '1', title: 'Business Name verified with Peshawar address', done: true },
    { id: '2', title: 'Office location pinned on Google Maps with landmark (JB Tower)', done: true },
    { id: '3', title: 'Working hours set (Mon-Sat 10:00 AM - 08:00 PM)', done: true },
    { id: '4', title: 'High-res photos of office exterior & property consultants', done: true },
    { id: '5', title: 'Request 5-star Google Reviews from satisfied buyers', done: false },
  ]);

  const selectedProp = properties.find(p => p.id === selectedPropId) || properties[0];

  const handleGenerateListing = () => {
    if (!selectedProp) return;

    if (langChoice === 'ur') {
      const urduCopy = 
`🏡 *شاندار موقع برائے فروخت: ${selectedProp.title}*
📍 *مقام:* ${selectedProp.location}
📐 *رقبہ:* ${formatArea(selectedProp.sizeMarla, 'marla', 'ur')} (${formatArea(selectedProp.sizeMarla, 'kanal', 'ur')})
💰 *ڈیمانڈ پرائس:* ${formatPKR(selectedProp.pricePkr, 'ur')}

✨ *نمایاں خصوصیات:*
${selectedProp.features.map(f => `• ${f}`).join('\n')}
• پی ڈی اے منظور شدہ نقشہ اور کلیئر رجسٹری
• فوری قبضہ اور بجلی، گیس، پانی کے کنکشن دستیاب

📞 *معائنہ اور مزید معلومات کے لیے فوری رابطہ کریں:*
🏢 *${settings.dealerName}*
📍 ${settings.address}
📲 واٹس ایپ اور کال: ${settings.phone}
---
#PeshawarRealEstate #Hayatabad #DHAPeshawar #PropertyForSale`;
      setGeneratedText(urduCopy);
    } else {
      const engCopy = 
`🏡 *PRIME INVESTMENT OPPORTUNITY: ${selectedProp.title.toUpperCase()}*
📍 *Location:* ${selectedProp.location}
📐 *Area Size:* ${formatArea(selectedProp.sizeMarla, 'marla', 'en')} (${formatArea(selectedProp.sizeMarla, 'kanal', 'en')})
💰 *Demand Price:* ${formatPKR(selectedProp.pricePkr, 'en')}

✨ *Key Highlights:*
${selectedProp.features.map(f => `• ${f}`).join('\n')}
• Clear Revenue Fard / PDA Allotment
• Ready for immediate construction / possession

📞 *For direct site inspection & meetings:*
🏢 *${settings.dealerName}*
📍 ${settings.address}
📲 WhatsApp / Call: ${settings.phone}
---
#PeshawarProperties #RealEstatePK #KhyberHeritage #PropDesk`;
      setGeneratedText(engCopy);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const gbpProgress = Math.round((gbpTasks.filter(t => t.done).length / gbpTasks.length) * 100);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-emerald-600" />
            <span>Marketing Suite & Urdu/English Caption Generator</span>
          </h2>
          <p className="text-xs text-slate-500">
            Generate high-converting property copy for WhatsApp Status, Facebook Pages, and OLX in 3 seconds
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Generator Controls (7 cols) */}
        <div className="lg:col-span-7 bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Listing Copy Generator
            </h3>

            {/* Language toggle */}
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={() => setLangChoice('ur')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  langChoice === 'ur' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                اردو اشتہار
              </button>
              <button
                type="button"
                onClick={() => setLangChoice('en')}
                className={`px-2.5 py-1 rounded text-xs font-semibold ${
                  langChoice === 'en' ? 'bg-white dark:bg-slate-900 text-emerald-600 shadow-xs' : 'text-slate-500'
                }`}
              >
                English Post
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Select Property Listing</label>
            <select
              value={selectedPropId}
              onChange={(e) => setSelectedPropId(e.target.value)}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-medium text-slate-800 dark:text-slate-200"
            >
              {properties.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({formatPKR(p.pricePkr, 'en')})
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            onClick={handleGenerateListing}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Marketing Copy</span>
          </button>

          {/* Output Textarea */}
          {generatedText && (
            <div className="space-y-2 pt-2 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[10px] uppercase text-slate-400">Ready to Post (WhatsApp / FB)</span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1 text-emerald-600 font-bold hover:underline"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied!' : 'Copy Caption'}</span>
                </button>
              </div>

              <textarea
                rows={11}
                readOnly
                value={generatedText}
                className="w-full p-3 bg-slate-50 dark:bg-slate-950 font-mono text-[11px] border border-slate-200 dark:border-slate-800 rounded-lg text-slate-800 dark:text-slate-200 select-all leading-relaxed"
              />
            </div>
          )}

        </div>

        {/* Social Poster Card & Google Business Profile (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Visual Poster Card Preview */}
          {selectedProp && (
            <div className="bg-gradient-to-tr from-slate-900 via-slate-800 to-emerald-950 text-white p-5 rounded-2xl shadow-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  {settings.dealerName} Official
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/20">
                  FOR SALE
                </span>
              </div>

              <div className="space-y-1">
                <p className="text-xs text-emerald-300 font-semibold">{selectedProp.location}</p>
                <h4 className="text-lg font-black tracking-tight leading-snug">
                  {selectedProp.title}
                </h4>
              </div>

              <div className="p-3 bg-white/10 backdrop-blur-xs rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase text-slate-300 font-bold">Demand Price</span>
                  <p className="text-base font-black text-emerald-300 tabular-nums">
                    {formatPKR(selectedProp.pricePkr, 'en')}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase text-slate-300 font-bold">Area</span>
                  <p className="text-xs font-bold text-white">
                    {formatArea(selectedProp.sizeMarla, 'marla', 'en')}
                  </p>
                </div>
              </div>

              <div className="text-[10px] text-slate-300 flex justify-between items-center border-t border-white/10 pt-2">
                <span>Call/WhatsApp: {settings.phone}</span>
                <span>{settings.area}, Peshawar</span>
              </div>
            </div>
          )}

          {/* Google Business Profile Readiness */}
          <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Google Business Profile Checklist
              </h3>
              <span className="font-bold text-emerald-600">{gbpProgress}% Ready</span>
            </div>

            <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-600 h-full rounded-full transition-all" style={{ width: `${gbpProgress}%` }} />
            </div>

            <div className="space-y-2 pt-1">
              {gbpTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={t.done}
                    onChange={() => {
                      setGbpTasks(gbpTasks.map(item => item.id === t.id ? { ...item, done: !item.done } : item));
                    }}
                    className="h-3.5 w-3.5 rounded text-emerald-600"
                  />
                  <span className={`text-[11px] ${t.done ? 'line-through text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>
                    {t.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
