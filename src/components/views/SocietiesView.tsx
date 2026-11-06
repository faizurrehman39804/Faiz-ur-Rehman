import React, { useState } from 'react';
import { 
  MapPin, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  BookmarkCheck, 
  Plus, 
  Printer, 
  X, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { Society, Plot, PropertyStatus, Language } from '../../types';
import { formatPKR, formatArea } from '../../utils/formatters';
import { translations } from '../../utils/translations';

interface SocietiesViewProps {
  societies: Society[];
  onBookPlot: (plotId: string, clientName: string, tokenPkr: number) => void;
  language: Language;
}

export const SocietiesView: React.FC<SocietiesViewProps> = ({
  societies,
  onBookPlot,
  language,
}) => {
  const t = translations[language];

  const [activeSocietyId, setActiveSocietyId] = useState<string>(societies[0]?.id || '');
  const [activeBlockName, setActiveBlockName] = useState<string>('');
  const [selectedPlot, setSelectedPlot] = useState<Plot | null>(null);

  // Booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [bookingClientName, setBookingClientName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('0300-');
  const [tokenAmount, setTokenAmount] = useState('500000');
  const [bookingSuccessReceipt, setBookingSuccessReceipt] = useState<any | null>(null);

  const activeSociety = societies.find(s => s.id === activeSocietyId) || societies[0];
  const activeBlock = activeSociety?.blocks.find(b => b.name === activeBlockName) || activeSociety?.blocks[0];

  const plotColor = (status: PropertyStatus) => {
    switch (status) {
      case 'available':
        return 'bg-emerald-100 hover:bg-emerald-200 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:border-emerald-800 dark:text-emerald-300';
      case 'hold':
        return 'bg-amber-100 hover:bg-amber-200 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:border-amber-800 dark:text-amber-300';
      case 'booked':
        return 'bg-blue-100 hover:bg-blue-200 text-blue-900 border-blue-300 dark:bg-blue-950/80 dark:border-blue-800 dark:text-blue-300';
      case 'sold':
        return 'bg-slate-200 text-slate-500 border-slate-300 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-500 cursor-not-allowed';
    }
  };

  const handleOpenBooking = (plot: Plot) => {
    setSelectedPlot(plot);
    setIsBookingModalOpen(true);
    setBookingSuccessReceipt(null);
  };

  const handleConfirmBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlot || !bookingClientName) return;
    
    onBookPlot(selectedPlot.id, bookingClientName, Number(tokenAmount));
    
    // Create preview receipt for dealer
    setBookingSuccessReceipt({
      receiptNo: `BKG-${Math.floor(1000 + Math.random() * 9000)}`,
      plotNumber: selectedPlot.plotNumber,
      society: selectedPlot.society,
      block: selectedPlot.block,
      size: `${selectedPlot.sizeMarla} Marla`,
      client: bookingClientName,
      phone: bookingPhone,
      tokenPaid: Number(tokenAmount),
      totalDemand: selectedPlot.pricePkr,
      date: new Date().toLocaleDateString(),
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
            {t.navSocieties}
          </h2>
          <p className="text-xs text-slate-500">
            Peshawar housing schemes, block grids, and interactive plot maps
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 shadow-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Available</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Hold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span className="text-[11px] text-slate-600 dark:text-slate-400">Sold</span>
          </div>
        </div>
      </div>

      {/* Society Selector Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {societies.map((soc) => {
          const isSelected = soc.id === activeSocietyId;
          return (
            <div
              key={soc.id}
              onClick={() => {
                setActiveSocietyId(soc.id);
                setActiveBlockName(soc.blocks[0]?.name || '');
                setSelectedPlot(null);
              }}
              className={`p-4 rounded-xl border transition-all cursor-pointer shadow-xs ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/40 ring-1 ring-emerald-600'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                    {soc.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">{soc.location}</p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                  {soc.totalPlots} Plots
                </span>
              </div>

              {/* Progress Bar of Sold / Available */}
              <div className="mt-3 space-y-1">
                <div className="flex justify-between text-[10px] text-slate-500 font-medium">
                  <span className="text-emerald-600 font-bold">{soc.availablePlots} Available</span>
                  <span>{soc.soldPlots + soc.bookedPlots} Taken</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden flex">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(soc.availablePlots / soc.totalPlots) * 100}%` }}
                  />
                  <div
                    className="bg-blue-500 h-full"
                    style={{ width: `${(soc.bookedPlots / soc.totalPlots) * 100}%` }}
                  />
                  <div
                    className="bg-slate-400 h-full"
                    style={{ width: `${(soc.soldPlots / soc.totalPlots) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Plot Grid Canvas */}
      {activeSociety && (
        <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-5">
          
          {/* Block Switcher Tabs */}
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Select Sector:</span>
              {activeSociety.blocks.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => {
                    setActiveBlockName(b.name);
                    setSelectedPlot(null);
                  }}
                  className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                    (activeBlockName || activeSociety.blocks[0].name) === b.name
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {b.name}
                </button>
              ))}
            </div>

            <div className="text-xs text-slate-500 font-medium">
              Click any plot tile to inspect details & book
            </div>
          </div>

          {/* Plot Map Tiles Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
            {activeBlock?.plots.map((plot) => {
              const isSelected = selectedPlot?.id === plot.id;
              return (
                <div
                  key={plot.id}
                  onClick={() => setSelectedPlot(plot)}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between h-28 relative ${
                    isSelected ? 'ring-2 ring-emerald-600 scale-[1.03] z-10' : ''
                  } ${plotColor(plot.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-black text-sm tracking-tight font-mono">
                      #{plot.plotNumber}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-wider">
                      {plot.status}
                    </span>
                  </div>

                  {/* Corner / Park Facing Tags */}
                  <div className="flex flex-wrap gap-1">
                    {plot.isCorner && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/10 font-bold">
                        Corner
                      </span>
                    )}
                    {plot.isParkFacing && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-black/10 font-bold">
                        Park
                      </span>
                    )}
                  </div>

                  <div className="pt-1 border-t border-black/10 flex justify-between items-center text-[10px]">
                    <span className="font-bold">{plot.sizeMarla} Marla</span>
                    <span className="font-extrabold">{formatPKR(plot.pricePkr, language)}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Plot Detail Card / Popover */}
          {selectedPlot && (
            <div className="p-4 rounded-xl border border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/60 dark:bg-emerald-950/30 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-150">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-base text-slate-900 dark:text-slate-100">
                    Plot #{selectedPlot.plotNumber} ({selectedPlot.block})
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-white dark:bg-slate-900 text-emerald-700 dark:text-emerald-300 border border-emerald-200">
                    {selectedPlot.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {selectedPlot.society} · Size: {formatArea(selectedPlot.sizeMarla, 'marla', language)} ({formatArea(selectedPlot.sizeMarla, 'kanal', language)}) · {selectedPlot.isCorner ? 'Corner Plot' : 'Standard'} {selectedPlot.isParkFacing ? '· Park Facing' : ''}
                </p>
                <p className="text-sm font-black text-emerald-800 dark:text-emerald-300 tabular-nums">
                  Price Demand: {formatPKR(selectedPlot.pricePkr, language)}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {selectedPlot.status === 'available' || selectedPlot.status === 'hold' ? (
                  <button
                    type="button"
                    onClick={() => handleOpenBooking(selectedPlot)}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                  >
                    <BookmarkCheck className="w-4 h-4" />
                    <span>{t.bookPlotBtn}</span>
                  </button>
                ) : (
                  <span className="text-xs font-semibold text-slate-500 italic">
                    Already {selectedPlot.status.toUpperCase()}
                  </span>
                )}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Plot Booking Form Modal with Instant Receipt */}
      {isBookingModalOpen && selectedPlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-lg p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Book Plot #{selectedPlot.plotNumber} ({selectedPlot.society})
                </h3>
                <p className="text-[11px] text-slate-500">
                  Enter buyer details to reserve plot and generate booking token receipt
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsBookingModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {!bookingSuccessReceipt ? (
              <form onSubmit={handleConfirmBooking} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Client / Buyer Name</label>
                  <input
                    type="text"
                    required
                    value={bookingClientName}
                    onChange={(e) => setBookingClientName(e.target.value)}
                    placeholder="e.g. Haji Noor Muhammad"
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Client Phone (WhatsApp)</label>
                    <input
                      type="text"
                      required
                      value={bookingPhone}
                      onChange={(e) => setBookingPhone(e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Token Advance (PKR)</label>
                    <input
                      type="number"
                      step="50000"
                      required
                      value={tokenAmount}
                      onChange={(e) => setTokenAmount(e.target.value)}
                      className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg text-[11px] space-y-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Plot Price:</span>
                    <span className="font-bold">{formatPKR(selectedPlot.pricePkr, language)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Token Amount:</span>
                    <span className="font-bold text-emerald-600">{formatPKR(Number(tokenAmount), language)}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                  >
                    Confirm Booking & Issue Receipt
                  </button>
                </div>
              </form>
            ) : (
              /* Booking Success Printable Receipt Preview */
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Plot Successfully Booked on Desk!</span>
                  </div>
                  <div className="border-t border-emerald-200 dark:border-emerald-800 pt-2 space-y-1 text-[11px]">
                    <p><strong>Booking Ref:</strong> {bookingSuccessReceipt.receiptNo}</p>
                    <p><strong>Plot:</strong> #{bookingSuccessReceipt.plotNumber} ({bookingSuccessReceipt.block}, {bookingSuccessReceipt.society})</p>
                    <p><strong>Client:</strong> {bookingSuccessReceipt.client} ({bookingSuccessReceipt.phone})</p>
                    <p><strong>Token Received:</strong> {formatPKR(bookingSuccessReceipt.tokenPaid, 'en')}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingModalOpen(false)}
                    className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold"
                  >
                    Close & View Map
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
