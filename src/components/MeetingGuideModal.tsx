import React, { useState } from 'react';
import { X, CheckCircle2, Copy, BookOpen, Clock, Target, HelpCircle } from 'lucide-react';
import { Language } from '../types';

interface MeetingGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
}

export const MeetingGuideModal: React.FC<MeetingGuideModalProps> = ({
  isOpen,
  onClose,
  language,
}) => {
  const [activeTab, setActiveTab] = useState<'questions' | 'demoFlow'>('questions');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const discoveryQuestions = [
    { num: 1, q: "Aap ka business kitne saal se hai aur kitne log kaam karte hain?", note: "Team size aur scale janne ke liye." },
    { num: 2, q: "Roz ki leads (calls, WhatsApp, walk-in) kahan se aati hain? Kaun si source sab se zyada kaam ki?", note: "Marketing channel priority samajhein." },
    { num: 3, q: "Jab koi lead aati hai to uska record kahan rakhte hain (register, Excel, WhatsApp, yaad)?", note: "Primary pain point: Register aur WhatsApp mein data gum hona." },
    { num: 4, q: "Pichlay mahine kitni inquiries aayin aur kitni par follow-up hua?", note: "Unhe realise karwayein ke follow-up na hone se kitna nuqsan hota hai." },
    { num: 5, q: "Properties ka hisaab kaise rakhte hain? Kabhi bik chuki property ka ad chalta raha?", note: "Inventory confusion aur duplicate listing ka masla." },
    { num: 6, q: "Installments aur payments ka record kaun rakhta hai aur kahan? Kabhi disagreement hua?", note: "SAB SE BARA PAIN POINT: Khata aur installment dispute." },
    { num: 7, q: "Client ke documents (CNIC, agreement, token receipt) kahan hain?", note: "File search karne mein ghanton zaya hote hain." },
    { num: 8, q: "Commission ka hisaab kaise hota hai? Kabhi jhagra hua?", note: "Agent commission transparency." },
    { num: 9, q: "Staff ke kaam par nazar kaise rakhte hain?", note: "Owner transparency aur accountability." },
    { num: 10, q: "Zameen/Graana/OLX ya koi software istemal kiya? Kya pasand aya, kya nahi?", note: "Past experience aur software budget mindset." },
    { num: 11, q: "Agar aap ka ek masla hum hal kar den to wo kaun sa hoga?", note: "Core decision driver: isi par close karna hai." },
    { num: 12, q: "Software ke liye mahine/salana kitna budget rakh sakte hain?", note: "Aakhir mein, narmi se poochhein." },
  ];

  const demoSteps = [
    {
      step: 1,
      title: "Pehle 10-15 Minute Sirf Sunein",
      detail: "Demo khole bina discovery questions se unke top 3 pain points sun kar paper ya Wishlist panel par likhein.",
    },
    {
      step: 2,
      title: "Dashboard: Ek Screen Par Poora Karobaar",
      detail: '"Ye dekhein Haji Sahab, subah aate hi aapko pata chalega aaj kitni payments due hain aur kitne follow-ups hain."',
    },
    {
      step: 3,
      title: "Unke Top Pain Point Par Pehla Attack",
      detail: "Agar paise/khata ka masla ho: Payments & Installments kholein, schedule aur instant printed receipt dikhayein. Agar leads gumti hon: Leads CRM aur WhatsApp 5-second quick capture dikhayein.",
    },
    {
      step: 4,
      title: "Societies & Interactive Plot Map",
      detail: '"DHA Peshawar ya Regi Model Town mein Block A/B/C ka har plot rang se batata hai kaun sa bik chuka hai aur kaun sa available."',
    },
    {
      step: 5,
      title: "Role Switcher: Staff vs Owner",
      detail: '"Role switcher se dikhayein ke Agent ko sirf apna kaam dikhega, commission aur accounts sirf aapke paas honge."',
    },
    {
      step: 6,
      title: "Public Website & Client Transparency Portal",
      detail: '"Aap ke naam aur logo ke saath public website aur client portal jahan buyer apni receipt aur payment schedule khud dekhta hai."',
    },
    {
      step: 7,
      title: "Urdu Toggle & Wishlist Note",
      detail: '"Staff ke liye ek click par poori app Urdu mein ho jati hai. Aur jo feature aapne maanga, maine wishlist mein likh liya hai."',
    },
  ];

  const handleCopyGuide = () => {
    const text = discoveryQuestions.map(d => `${d.num}. ${d.q} (${d.note})`).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-amber-100 dark:bg-amber-950/70 text-amber-700 dark:text-amber-400 rounded-lg">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Dealer First Meeting: Discovery & Demo Guide
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Prepared for Faiz (AfnixByte) · Peshawar Real Estate Sales Flow
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="px-5 pt-3 pb-2 border-b border-slate-200 dark:border-slate-800 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('questions')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'questions'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            12 Discovery Questions (Roman Urdu)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('demoFlow')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'demoFlow'
                ? 'bg-amber-600 text-white'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            10-Minute Demo Script & Order
          </button>

          <button
            type="button"
            onClick={handleCopyGuide}
            className="ml-auto flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 px-2.5 py-1 rounded border border-slate-200 dark:border-slate-700"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? 'Copied!' : 'Copy Questions'}</span>
          </button>
        </div>

        {/* Content body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs leading-relaxed text-slate-700 dark:text-slate-300">
          {activeTab === 'questions' ? (
            <div className="space-y-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg text-amber-900 dark:text-amber-200 text-xs">
                <strong>Meeting Rule:</strong> Demo dikhane se pehle 10-15 minute sunein. Dealer ke apne alfaaz mein top 3 pain points likhein, phir demo mein sirf wahi modules pehle dikhayein!
              </div>

              <div className="grid gap-2.5">
                {discoveryQuestions.map((item) => (
                  <div
                    key={item.num}
                    className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors"
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[11px] shrink-0 mt-0.5">
                        {item.num}
                      </span>
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.q}
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 italic">
                          Maqsad: {item.note}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 rounded-lg text-emerald-900 dark:text-emerald-200 text-xs">
                <strong>Golden Advice:</strong> Demo mein feature dikhane ki jaldi na karein. Dealer ke pain point par jitna waqt lagayein ge, deal pakki hone ka chance utna barhe ga.
              </div>

              <div className="space-y-3">
                {demoSteps.map((s) => (
                  <div key={s.step} className="p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start gap-3">
                    <span className="w-6 h-6 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center shrink-0 text-xs">
                      {s.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs mb-1">
                        {s.title}
                      </h4>
                      <p className="text-slate-600 dark:text-slate-400 text-xs">
                        {s.detail}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            Click outside or Esc to close anytime during demo.
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 font-semibold text-xs rounded-lg hover:bg-slate-800 dark:hover:bg-white"
          >
            Got It, Let's Demo
          </button>
        </div>

      </div>
    </div>
  );
};
