import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Filter, 
  LayoutGrid, 
  List, 
  MapPin, 
  Share2, 
  CheckCircle, 
  AlertTriangle, 
  Globe2, 
  X, 
  Bed, 
  Bath, 
  Maximize2, 
  FileText, 
  ChevronRight,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';
import { Property, PropertyType, PropertyStatus, UserRole, Language } from '../../types';
import { formatPKR, formatArea } from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface InventoryViewProps {
  properties: Property[];
  onAddProperty: (property: Property) => void;
  onUpdatePropertyStatus: (propertyId: string, status: PropertyStatus) => void;
  onTogglePublish: (propertyId: string) => void;
  currentRole: UserRole;
  language: Language;
}

export const InventoryView: React.FC<InventoryViewProps> = ({
  properties,
  onAddProperty,
  onUpdatePropertyStatus,
  onTogglePublish,
  currentRole,
  language,
}) => {
  const t = translations[language];

  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSociety, setSelectedSociety] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPurpose, setSelectedPurpose] = useState<'all' | 'sale' | 'rent'>('all');
  
  // Selected Property for detail modal
  const [selectedProp, setSelectedProp] = useState<Property | null>(null);

  // Add property wizard modal
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardData, setWizardData] = useState({
    title: '',
    society: 'Hayatabad',
    location: 'Hayatabad Phase 5',
    type: 'house' as PropertyType,
    sizeMarla: 10,
    pricePkr: 32000000,
    purpose: 'sale' as 'sale' | 'rent',
    bedrooms: 5,
    bathrooms: 5,
    ownerName: 'Malik Tariq Khan',
    ownerPhone: '0300-8889999',
    isPublished: true,
  });

  // Filter properties
  const filteredProps = properties.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSociety = selectedSociety === 'all' || p.society.toLowerCase().includes(selectedSociety.toLowerCase());
    const matchesType = selectedType === 'all' || p.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
    const matchesPurpose = selectedPurpose === 'all' || p.purpose === selectedPurpose;
    return matchesSearch && matchesSociety && matchesType && matchesStatus && matchesPurpose;
  });

  const statusBadge = (st: PropertyStatus) => {
    switch (st) {
      case 'available':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">AVAILABLE</span>;
      case 'hold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">ON HOLD</span>;
      case 'booked':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">BOOKED</span>;
      case 'sold':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300">SOLD</span>;
    }
  };

  const handleShareWhatsApp = (p: Property) => {
    const text = encodeURIComponent(
      `*PROPDESK LISTING: ${p.title.toUpperCase()}*\n` +
      `--------------------------------\n` +
      `📍 Location: ${p.location}\n` +
      `📐 Size: ${formatArea(p.sizeMarla, 'marla', 'en')} (${formatArea(p.sizeMarla, 'kanal', 'en')})\n` +
      `💰 Demand: ${formatPKR(p.pricePkr, 'en')}\n` +
      `📑 Status: ${p.status.toUpperCase()}\n` +
      (p.bedrooms ? `🛏️ Bedrooms: ${p.bedrooms} | Baths: ${p.bathrooms}\n` : '') +
      `✨ Key Features: ${p.features.join(', ')}\n` +
      `--------------------------------\n` +
      `Contact Khyber Heritage Real Estate / PropDesk: 0300-5921840`
    );
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const handleWizardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newP: Property = {
      id: `prop-${Date.now()}`,
      title: wizardData.title || `${wizardData.sizeMarla} Marla ${wizardData.type} in ${wizardData.location}`,
      location: wizardData.location,
      society: wizardData.society,
      type: wizardData.type,
      sizeMarla: wizardData.sizeMarla,
      pricePkr: Number(wizardData.pricePkr),
      status: 'available',
      bedrooms: wizardData.bedrooms,
      bathrooms: wizardData.bathrooms,
      purpose: wizardData.purpose,
      isPublished: wizardData.isPublished,
      agentId: 'staff-1',
      agentName: 'Faiz Rehman',
      ownerName: wizardData.ownerName,
      ownerPhone: wizardData.ownerPhone,
      daysOnMarket: 1,
      features: ['Prime Location', 'NOC Verified', 'Immediate Possession'],
      documents: [
        { title: 'Allotment Letter', verified: true, type: 'pdf' },
        { title: 'Tax Clearance FBR', verified: true, type: 'pdf' },
      ],
    };
    onAddProperty(newP);
    setIsWizardOpen(false);
    setWizardStep(1);
  };

  return (
    <div className="space-y-5">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.navInventory}
          </h2>
          <p className="text-xs text-slate-500">
            Active property listings across Peshawar (Hayatabad, DHA, Regi, University Town)
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsWizardOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{t.addProperty} (Wizard)</span>
        </button>
      </div>

      {/* Filter and View Toggles Bar */}
      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shadow-xs">
        
        {/* Search */}
        <div className="flex items-center gap-2 w-full sm:w-64 bg-slate-50 dark:bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700">
          <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search by title, sector, street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent text-xs w-full focus:outline-none text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          
          <select
            value={selectedSociety}
            onChange={(e) => setSelectedSociety(e.target.value)}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Locations</option>
            <option value="Hayatabad">Hayatabad</option>
            <option value="DHA">DHA Peshawar</option>
            <option value="Regi">Regi Model Town</option>
            <option value="University Town">University Town</option>
            <option value="Ring Road">Ring Road</option>
            <option value="Saddar">Saddar</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Types</option>
            <option value="plot">Plots</option>
            <option value="house">Houses</option>
            <option value="flat">Flats</option>
            <option value="shop">Shops</option>
            <option value="commercial_plot">Commercial Plots</option>
            <option value="rental">Rentals</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-1.5 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
          >
            <option value="all">All Statuses</option>
            <option value="available">Available</option>
            <option value="hold">On Hold</option>
            <option value="booked">Booked</option>
            <option value="sold">Sold</option>
          </select>

          {/* View Toggles */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-0.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'grid' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'list' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode('map')}
              className={`p-1.5 rounded-md transition-colors ${
                viewMode === 'map' ? 'bg-white dark:bg-slate-900 shadow-xs text-emerald-600' : 'text-slate-500'
              }`}
              title="Peshawar Map View"
            >
              <MapPin className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProps.map((prop) => (
            <div
              key={prop.id}
              onClick={() => setSelectedProp(prop)}
              className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-md hover:border-emerald-500/60 transition-all cursor-pointer flex flex-col group"
            >
              {/* Image Gradient Placeholder with Type Icon */}
              <div className="h-44 bg-gradient-to-tr from-slate-800 via-slate-700 to-emerald-950 relative p-4 flex flex-col justify-between text-white">
                <div className="flex items-center justify-between">
                  {statusBadge(prop.status)}
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 backdrop-blur-xs uppercase tracking-wider">
                    {prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-xs text-emerald-300 font-semibold mb-1">
                    <MapPin className="w-3.5 h-3.5" />
                    <span className="truncate">{prop.location}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                    {prop.title}
                  </h3>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                
                {/* Specs Strip */}
                <div className="flex items-center gap-3 text-xs text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2.5">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {formatArea(prop.sizeMarla, 'marla', language)}
                  </span>
                  <span>·</span>
                  {prop.bedrooms && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5" /> {prop.bedrooms} Beds
                    </span>
                  )}
                  {prop.bathrooms && (
                    <span className="flex items-center gap-1">
                      <Bath className="w-3.5 h-3.5" /> {prop.bathrooms} Baths
                    </span>
                  )}
                  <span className="ml-auto text-[10px] text-slate-400 font-mono">
                    {prop.daysOnMarket}d on desk
                  </span>
                </div>

                {/* Price and Action */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Demand</span>
                    <p className="text-base font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                      {formatPKR(prop.pricePkr, language)}
                    </p>
                  </div>

                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleShareWhatsApp(prop)}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 hover:bg-emerald-100 transition-colors"
                      title="Share brochure on WhatsApp"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedProp(prop)}
                      className="px-3 py-1.5 text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded-lg transition-colors"
                    >
                      Details
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Property Title</th>
                <th className="p-3">Location</th>
                <th className="p-3">Type</th>
                <th className="p-3">Size</th>
                <th className="p-3">Demand Price</th>
                <th className="p-3">Status</th>
                <th className="p-3">Website</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredProps.map((prop) => (
                <tr
                  key={prop.id}
                  onClick={() => setSelectedProp(prop)}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/40 cursor-pointer"
                >
                  <td className="p-3 font-semibold text-slate-900 dark:text-slate-100">
                    {prop.title}
                    <div className="text-[10px] text-slate-400 font-normal">Agent: {prop.agentName}</div>
                  </td>
                  <td className="p-3 text-slate-600 dark:text-slate-400">{prop.location}</td>
                  <td className="p-3 text-slate-700 dark:text-slate-300 capitalize">{prop.type.replace('_', ' ')}</td>
                  <td className="p-3 font-medium">{formatArea(prop.sizeMarla, 'marla', language)}</td>
                  <td className="p-3 font-bold text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(prop.pricePkr, language)}
                  </td>
                  <td className="p-3">{statusBadge(prop.status)}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => onTogglePublish(prop.id)}
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                        prop.isPublished
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-800'
                      }`}
                    >
                      {prop.isPublished ? 'Published' : 'Hidden'}
                    </button>
                  </td>
                  <td className="p-3 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => setSelectedProp(prop)}
                      className="px-2.5 py-1 text-xs text-emerald-600 font-semibold hover:bg-emerald-50 rounded"
                    >
                      View →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Peshawar Interactive Map View (Stylized SVG Canvas) */}
      {viewMode === 'map' && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Peshawar Region Properties Geographic Map
              </h3>
              <p className="text-xs text-slate-500">Interactive territory visualization with live pin density</p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {filteredProps.length} Properties Pinned
            </span>
          </div>

          {/* SVG Map Canvas */}
          <div className="relative w-full h-96 bg-slate-100 dark:bg-slate-950 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 flex items-center justify-center">
            
            {/* Peshawar stylized arterial roads */}
            <svg className="absolute inset-0 w-full h-full stroke-slate-300 dark:stroke-slate-800" strokeWidth="3" fill="none">
              {/* Grand Trunk & Jamrud Road Axis */}
              <path d="M 50 200 L 750 200" strokeWidth="6" stroke="#94A3B8" opacity="0.6" />
              {/* Ring Road Peshawar Ring */}
              <circle cx="480" cy="210" r="140" stroke="#CBD5E1" strokeWidth="4" strokeDasharray="6 4" />
              {/* Nasir Bagh Road (To Regi & DHA) */}
              <path d="M 220 200 L 120 70" strokeWidth="4" stroke="#059669" opacity="0.7" />
              {/* Warsak Road */}
              <path d="M 380 200 L 340 40" strokeWidth="4" stroke="#64748B" />
              {/* Charsadda Road */}
              <path d="M 540 200 L 620 30" strokeWidth="4" stroke="#64748B" />
            </svg>

            {/* Geographic Cluster Markers */}
            <div className="absolute top-16 left-24 text-center">
              <button
                type="button"
                onClick={() => setSelectedSociety('DHA')}
                className="p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-1 text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5" /> DHA Peshawar
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">5 Plots Available</span>
            </div>

            <div className="absolute top-12 left-64 text-center">
              <button
                type="button"
                onClick={() => setSelectedSociety('Regi')}
                className="p-2 rounded-full bg-emerald-600 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-1 text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5" /> Regi Model Town
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">Zone 3 & 4</span>
            </div>

            <div className="absolute top-44 left-32 text-center">
              <button
                type="button"
                onClick={() => setSelectedSociety('Hayatabad')}
                className="p-2 rounded-full bg-emerald-700 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-1 text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5" /> Hayatabad (Phase 1-7)
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">Houses & Commercial</span>
            </div>

            <div className="absolute top-44 right-64 text-center">
              <button
                type="button"
                onClick={() => setSelectedSociety('University Town')}
                className="p-2 rounded-full bg-blue-600 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-1 text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5" /> University Town / Saddar
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">Prime Office & Villas</span>
            </div>

            <div className="absolute bottom-12 right-48 text-center">
              <button
                type="button"
                onClick={() => setSelectedSociety('Ring Road')}
                className="p-2 rounded-full bg-purple-600 text-white shadow-lg hover:scale-110 transition-transform flex items-center gap-1 text-[11px] font-bold"
              >
                <MapPin className="w-3.5 h-3.5" /> Ring Road Commercial
              </button>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block">Commercial Plots</span>
            </div>

          </div>
        </div>
      )}

      {/* Property Detail Modal */}
      {selectedProp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
            
            {/* Top Modal Header */}
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/70 dark:bg-slate-800/40">
              <div className="flex items-center gap-2">
                {statusBadge(selectedProp.status)}
                <span className="text-xs font-semibold text-slate-500">
                  {selectedProp.location}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedProp(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs">
              
              {/* Title & Demand */}
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                    {selectedProp.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {selectedProp.society} · Added by Agent {selectedProp.agentName}
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Demand</span>
                  <p className="text-xl font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                    {formatPKR(selectedProp.pricePkr, language)}
                  </p>
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-3 gap-3 p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Area Size</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                    {formatArea(selectedProp.sizeMarla, 'marla', language)} ({formatArea(selectedProp.sizeMarla, 'kanal', language)})
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Category</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                    {selectedProp.type.replace('_', ' ')}
                  </p>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 uppercase font-semibold">Purpose</span>
                  <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5 capitalize">
                    For {selectedProp.purpose}
                  </p>
                </div>
              </div>

              {/* Duplicate Listing Warning Demonstration */}
              {selectedProp.status === 'hold' && (
                <div className="p-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 rounded-lg flex items-center gap-2.5 text-amber-900 dark:text-amber-200">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                  <div>
                    <span className="font-bold text-xs">Duplicate Deal Warning:</span>
                    <p className="text-[11px]">This property is currently in active negotiations with Dr. Asadullah. Token cannot be received from another party without Owner override.</p>
                  </div>
                </div>
              )}

              {/* Documents Checklist */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  Verified Legal Documents
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedProp.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between"
                    >
                      <span className="font-medium text-slate-700 dark:text-slate-300">{doc.title}</span>
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
                        <CheckCircle className="w-3 h-3" /> Verified
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Owner Info (Permission-Aware) */}
              <div className="p-3 border border-slate-200 dark:border-slate-800 rounded-lg space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400">Seller / Owner on Record</span>
                {currentRole === 'agent' ? (
                  <p className="text-slate-500 italic">
                    [Hidden for Agent Role - Contact Principal Dealer for Owner Direct Meetings]
                  </p>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 dark:text-slate-100">{selectedProp.ownerName}</p>
                      <p className="text-slate-500 font-mono">{selectedProp.ownerPhone}</p>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded font-bold">
                      Direct Owner
                    </span>
                  </div>
                )}
              </div>

              {/* Status Actions */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase text-slate-400">Change Status</label>
                <div className="flex items-center gap-2">
                  {(['available', 'hold', 'booked', 'sold'] as PropertyStatus[]).map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        onUpdatePropertyStatus(selectedProp.id, st);
                        setSelectedProp({ ...selectedProp, status: st });
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors ${
                        selectedProp.status === st
                          ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900'
                          : 'border border-slate-200 dark:border-slate-700 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Bottom Buttons */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 flex items-center justify-between">
              <button
                type="button"
                onClick={() => onTogglePublish(selectedProp.id)}
                className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300 font-semibold"
              >
                <Globe2 className="w-4 h-4 text-emerald-600" />
                <span>{selectedProp.isPublished ? 'Published on Public Site' : 'Unpublished from Website'}</span>
              </button>

              <button
                type="button"
                onClick={() => handleShareWhatsApp(selectedProp)}
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Share WhatsApp Brochure
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Multi-step Add Property Wizard */}
      {isWizardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Add Property (Wizard Step {wizardStep} of 3)
                </h3>
                <p className="text-[11px] text-slate-500">
                  {wizardStep === 1 && 'Basic specs & property category'}
                  {wizardStep === 2 && 'Pricing & Peshawar location'}
                  {wizardStep === 3 && 'Owner details & public website publish'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsWizardOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleWizardSubmit} className="space-y-4 text-xs">
              {wizardStep === 1 && (
                <div className="space-y-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Listing Headline Title</label>
                    <input
                      type="text"
                      required
                      value={wizardData.title}
                      onChange={(e) => setWizardData({ ...wizardData, title: e.target.value })}
                      placeholder="e.g. 10 Marla Brand New House near Phase 4 Park"
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Property Type</label>
                      <select
                        value={wizardData.type}
                        onChange={(e) => setWizardData({ ...wizardData, type: e.target.value as any })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      >
                        <option value="plot">Residential Plot</option>
                        <option value="house">House / Villa</option>
                        <option value="flat">Apartment / Flat</option>
                        <option value="shop">Commercial Shop</option>
                        <option value="commercial_plot">Commercial Plot</option>
                        <option value="rental">Rental</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Size (Marla)</label>
                      <input
                        type="number"
                        required
                        value={wizardData.sizeMarla}
                        onChange={(e) => setWizardData({ ...wizardData, sizeMarla: Number(e.target.value) })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>
                </div>
              )}

              {wizardStep === 2 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Society / Scheme</label>
                      <select
                        value={wizardData.society}
                        onChange={(e) => setWizardData({ ...wizardData, society: e.target.value })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      >
                        <option value="Hayatabad">Hayatabad (Phase 1-7)</option>
                        <option value="DHA Peshawar">DHA Peshawar</option>
                        <option value="Regi Model Town">Regi Model Town</option>
                        <option value="University Town">University Town</option>
                        <option value="Warsak Road">Warsak Road</option>
                        <option value="Ring Road">Ring Road</option>
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Specific Sector / Street</label>
                      <input
                        type="text"
                        required
                        value={wizardData.location}
                        onChange={(e) => setWizardData({ ...wizardData, location: e.target.value })}
                        placeholder="e.g. Phase 3, Sector B"
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Demand Price (PKR)</label>
                    <input
                      type="number"
                      step="100000"
                      required
                      value={wizardData.pricePkr}
                      onChange={(e) => setWizardData({ ...wizardData, pricePkr: Number(e.target.value) })}
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    />
                    <p className="text-[11px] text-emerald-600 mt-1 font-semibold">
                      Preview: {formatPKR(wizardData.pricePkr, language)}
                    </p>
                  </div>
                </div>
              )}

              {wizardStep === 3 && (
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Owner Name</label>
                      <input
                        type="text"
                        required
                        value={wizardData.ownerName}
                        onChange={(e) => setWizardData({ ...wizardData, ownerName: e.target.value })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Owner Contact</label>
                      <input
                        type="text"
                        required
                        value={wizardData.ownerPhone}
                        onChange={(e) => setWizardData({ ...wizardData, ownerPhone: e.target.value })}
                        className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-lg flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900 dark:text-slate-100">Publish to Public Website</span>
                      <p className="text-[11px] text-slate-500">Show on your dealership's branded web page</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={wizardData.isPublished}
                      onChange={(e) => setWizardData({ ...wizardData, isPublished: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              )}

              {/* Wizard Steps Navigation */}
              <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
                {wizardStep > 1 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep - 1)}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    Back
                  </button>
                ) : <div />}

                {wizardStep < 3 ? (
                  <button
                    type="button"
                    onClick={() => setWizardStep(wizardStep + 1)}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                  >
                    Save & Publish Property
                  </button>
                )}
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
