import React, { useState } from 'react';
import { CalendarDays, Clock, MapPin, User, CheckCircle2, Plus, X } from 'lucide-react';
import { SiteVisit, Language } from '../../types';

interface CalendarViewProps {
  visits: SiteVisit[];
  onAddVisit: (visit: SiteVisit) => void;
  language: Language;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  visits,
  onAddVisit,
  language,
}) => {
  const [activeDate, setActiveDate] = useState('2026-11-07');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clientName, setClientName] = useState('');
  const [propertyTitle, setPropertyTitle] = useState('1 Kanal Villa - Hayatabad Phase 3');
  const [visitTime, setVisitTime] = useState('04:00 PM');
  const [agentName, setAgentName] = useState('Tariq Bangash');
  const [notes, setNotes] = useState('Client visiting with family');

  const days = [
    { date: '2026-11-05', dayName: 'Thu', visitsCount: 1 },
    { date: '2026-11-06', dayName: 'Fri', visitsCount: 1 },
    { date: '2026-11-07', dayName: 'Sat', visitsCount: 2 },
    { date: '2026-11-08', dayName: 'Sun', visitsCount: 2 },
    { date: '2026-11-09', dayName: 'Mon', visitsCount: 1 },
    { date: '2026-11-10', dayName: 'Tue', visitsCount: 1 },
    { date: '2026-11-11', dayName: 'Wed', visitsCount: 0 },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName) return;
    const newV: SiteVisit = {
      id: `vis-${Date.now()}`,
      clientName,
      clientPhone: '0300-1122334',
      propertyTitle,
      location: 'Peshawar',
      date: activeDate,
      time: visitTime,
      agentName,
      status: 'scheduled',
      notes,
    };
    onAddVisit(newV);
    setIsModalOpen(false);
    setClientName('');
  };

  const filteredVisits = visits.filter(v => v.date === activeDate);

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-emerald-600" />
            <span>Site Visits & Inspections Calendar</span>
          </h2>
          <p className="text-xs text-slate-500">
            Schedule on-ground client walkthroughs in Hayatabad, Regi Model Town, and DHA Peshawar
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule Visit</span>
        </button>
      </div>

      {/* Week Day Strips */}
      <div className="grid grid-cols-7 gap-2 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
        {days.map((d) => {
          const isSelected = d.date === activeDate;
          return (
            <button
              key={d.date}
              type="button"
              onClick={() => setActiveDate(d.date)}
              className={`p-3 rounded-xl text-center transition-all ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-xs font-bold scale-[1.02]'
                  : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider block opacity-80">{d.dayName}</span>
              <span className="text-base font-extrabold block">{d.date.slice(-2)}</span>
              {d.visitsCount > 0 && (
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full inline-block mt-1 ${
                  isSelected ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                }`}>
                  {d.visitsCount} visits
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Agenda for Active Date */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Agenda for {activeDate}
          </h3>
          <span className="text-xs text-slate-500">
            {filteredVisits.length} appointments scheduled
          </span>
        </div>

        {filteredVisits.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            No site inspections scheduled for this date. Click "+ Schedule Visit" to book one!
          </div>
        ) : (
          <div className="space-y-3">
            {filteredVisits.map((vis) => (
              <div
                key={vis.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-slate-300 flex items-start justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 dark:text-slate-100 text-sm">
                      {vis.clientName}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-bold">
                      {vis.time}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 font-medium">
                    Property: {vis.propertyTitle} ({vis.location})
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Assigned Agent: {vis.agentName} · Notes: {vis.notes}
                  </p>
                </div>

                <span className="text-[10px] font-bold px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 capitalize shrink-0">
                  {vis.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Book Site Inspection
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Client Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. Zia-ur-Rehman Orakzai"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Property to Inspect</label>
                <input
                  type="text"
                  required
                  value={propertyTitle}
                  onChange={(e) => setPropertyTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Time</label>
                  <input
                    type="text"
                    value={visitTime}
                    onChange={(e) => setVisitTime(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Agent</label>
                  <input
                    type="text"
                    value={agentName}
                    onChange={(e) => setAgentName(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Save Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
