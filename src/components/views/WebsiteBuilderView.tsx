import React, { useState } from 'react';
import { 
  Globe, 
  Smartphone, 
  Monitor, 
  ExternalLink, 
  Sparkles, 
  Check, 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Share2,
  CheckCircle2,
  Search
} from 'lucide-react';
import { Property, DealerSettings, Language } from '../../types';
import { formatPKR, formatArea } from '../../utils/formatters';

interface WebsiteBuilderViewProps {
  properties: Property[];
  settings: DealerSettings;
  onUpdateSettings: (settings: Partial<DealerSettings>) => void;
  onTogglePublish: (propertyId: string) => void;
  language: Language;
}

export const WebsiteBuilderView: React.FC<WebsiteBuilderViewProps> = ({
  properties,
  settings,
  onUpdateSettings,
  onTogglePublish,
  language,
}) => {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop');
  const [siteFilter, setSiteFilter] = useState('all');

  const publishedProps = properties.filter(p => p.isPublished);

  const colorOptions = [
    { name: 'Emerald', hex: '#059669' },
    { name: 'Royal Blue', hex: '#2563EB' },
    { name: 'Warm Amber', hex: '#D97706' },
    { name: 'Midnight', hex: '#0F172A' },
  ];

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" />
            <span>Public Dealer Website Generator & Live Preview</span>
          </h2>
          <p className="text-xs text-slate-500">
            Showcase your agency with an instant branded web portal powered by your live PropDesk inventory
          </p>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-lg border border-slate-200 dark:border-slate-700 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setDeviceMode('desktop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              deviceMode === 'desktop' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
          <button
            type="button"
            onClick={() => setDeviceMode('mobile')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
              deviceMode === 'mobile' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile</span>
          </button>
        </div>
      </div>

      {/* 2-Column Workspace: Left Live Customizer + Right Preview Frame */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Customizer Settings Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 text-xs">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-2">
            Website Branding Controls
          </h3>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Dealership Brand Name</label>
            <input
              type="text"
              value={settings.dealerName}
              onChange={(e) => onUpdateSettings({ dealerName: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 font-bold"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Marketing Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => onUpdateSettings({ tagline: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          {/* Color Palette Picker */}
          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1.5">Primary Brand Accent</label>
            <div className="flex items-center gap-2">
              {colorOptions.map((c) => (
                <button
                  key={c.hex}
                  type="button"
                  onClick={() => onUpdateSettings({ primaryColor: c.hex })}
                  style={{ backgroundColor: c.hex }}
                  className={`w-7 h-7 rounded-full transition-transform flex items-center justify-center text-white ${
                    settings.primaryColor === c.hex ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : ''
                  }`}
                  title={c.name}
                >
                  {settings.primaryColor === c.hex && <Check className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">WhatsApp / Phone Number</label>
            <input
              type="text"
              value={settings.phone}
              onChange={(e) => onUpdateSettings({ phone: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          <div>
            <label className="block text-slate-600 dark:text-slate-400 font-semibold mb-1">Office Address</label>
            <textarea
              rows={2}
              value={settings.address}
              onChange={(e) => onUpdateSettings({ address: e.target.value })}
              className="w-full p-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
            />
          </div>

          {/* Published Inventory Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-700 dark:text-slate-300">Featured on Website</span>
              <span className="text-[10px] text-emerald-600 font-bold">{publishedProps.length} Live</span>
            </div>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {properties.map((p) => (
                <label key={p.id} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={p.isPublished}
                    onChange={() => onTogglePublish(p.id)}
                    className="h-3.5 w-3.5 rounded text-emerald-600"
                  />
                  <span className="truncate text-[11px] text-slate-700 dark:text-slate-300">{p.title}</span>
                </label>
              ))}
            </div>
          </div>

        </div>

        {/* Right Live Website Viewport (8 cols) */}
        <div className="lg:col-span-8 flex justify-center">
          <div className={`transition-all duration-300 w-full ${
            deviceMode === 'mobile' ? 'max-w-sm rounded-[32px] border-[8px] border-slate-800 shadow-2xl p-1 bg-slate-800' : 'max-w-4xl rounded-xl border border-slate-300 dark:border-slate-700 shadow-md'
          }`}>
            
            {/* Browser Top Chrome */}
            <div className="bg-slate-200 dark:bg-slate-800 px-3 py-2 rounded-t-lg flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              </div>
              <div className="px-3 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-slate-500 font-mono text-[10px] w-64 text-center truncate">
                https://{settings.dealerName.toLowerCase().replace(/[^a-z0-9]/g, '')}.pk
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Embedded Live Public Site Preview */}
            <div className="bg-white text-slate-900 overflow-y-auto max-h-[640px] select-text">
              
              {/* Site Navbar */}
              <nav className="p-4 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-xs z-10">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-base tracking-tight" style={{ color: settings.primaryColor }}>
                    {settings.dealerName}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-semibold">
                  <span className="hidden sm:inline text-slate-600">Properties</span>
                  <span className="hidden sm:inline text-slate-600">Societies</span>
                  <span className="hidden sm:inline text-slate-600">Contact</span>
                  <a
                    href={`https://wa.me/92${settings.phone.replace(/[^0-9]/g, '').slice(-10)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ backgroundColor: settings.primaryColor }}
                    className="px-3 py-1.5 text-white rounded-lg text-xs font-bold"
                  >
                    WhatsApp Us
                  </a>
                </div>
              </nav>

              {/* Site Hero Banner */}
              <div className="p-8 text-center space-y-3 bg-gradient-to-b from-slate-50 to-white border-b border-slate-100">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  {settings.area}, {settings.city} · Registered Property Consultants
                </span>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight max-w-xl mx-auto">
                  Find Your Dream Home & Verified Plots in Peshawar
                </h1>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  {settings.tagline}
                </p>

                {/* Mini Search Widget */}
                <div className="max-w-lg mx-auto pt-2 flex items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm text-xs">
                  <Search className="w-4 h-4 text-slate-400 ml-1" />
                  <input
                    type="text"
                    placeholder="Search Hayatabad, DHA, Regi Model Town..."
                    className="w-full bg-transparent focus:outline-none text-xs"
                    readOnly
                  />
                  <button
                    type="button"
                    style={{ backgroundColor: settings.primaryColor }}
                    className="px-4 py-1.5 text-white font-bold rounded-lg shrink-0"
                  >
                    Search
                  </button>
                </div>
              </div>

              {/* Featured Properties Grid */}
              <div className="p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-950">
                      Featured Verified Listings
                    </h3>
                    <p className="text-xs text-slate-500">Inspected by our on-ground property specialists</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {publishedProps.length} Available
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {publishedProps.map((p) => (
                    <div key={p.id} className="border border-slate-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                      <div className="h-28 bg-gradient-to-tr from-slate-800 to-slate-900 p-3 text-white flex flex-col justify-between">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-black/40 self-start uppercase">
                          {p.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                        </span>
                        <div>
                          <p className="text-[11px] text-emerald-300 font-semibold">{p.location}</p>
                          <h4 className="font-bold text-xs truncate text-white">{p.title}</h4>
                        </div>
                      </div>
                      <div className="p-3 space-y-2 text-xs">
                        <div className="flex justify-between items-center text-[11px]">
                          <span className="font-bold text-slate-700">{formatArea(p.sizeMarla, 'marla', 'en')}</span>
                          <span className="font-black text-emerald-700 tabular-nums">{formatPKR(p.pricePkr, 'en')}</span>
                        </div>
                        <a
                          href={`https://wa.me/92${settings.phone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(`Assalam-o-Alaikum, I am interested in ${p.title}`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block text-center py-1.5 rounded-lg border border-slate-200 text-slate-700 font-semibold text-[11px] hover:bg-slate-50"
                        >
                          Inquire on WhatsApp
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Site Footer */}
              <footer className="p-6 bg-slate-900 text-white text-xs space-y-3">
                <div className="flex flex-col sm:flex-row justify-between gap-4">
                  <div>
                    <h4 className="font-bold text-sm">{settings.dealerName}</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">{settings.address}</p>
                    <p className="text-slate-400 text-[11px]">Phone: {settings.phone}</p>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <p className="font-semibold text-white">Trust Guarantee</p>
                    <p>Verified Revenue Registry & PDA Approved Maps only.</p>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 text-center">
                  © 2026 {settings.dealerName}. Powered by PropDesk Real Estate OS.
                </div>
              </footer>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
};
