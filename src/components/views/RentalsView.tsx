import React, { useState } from 'react';
import { KeyRound, Calendar, Plus, CheckCircle, AlertCircle, Phone, MessageSquare, Wrench } from 'lucide-react';
import { RentalLease, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface RentalsViewProps {
  rentals: RentalLease[];
  onRentReceived: (rentalId: string) => void;
  language: Language;
}

export const RentalsView: React.FC<RentalsViewProps> = ({
  rentals,
  onRentReceived,
  language,
}) => {
  const [rentList, setRentList] = useState<RentalLease[]>(rentals);

  const handleMarkReceived = (id: string) => {
    onRentReceived(id);
    setRentList(
      rentList.map(r =>
        r.id === id ? { ...r, lastPaymentDate: new Date().toISOString().split('T')[0] } : r
      )
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-emerald-600" />
            <span>Rentals, Tenants & Lease Management</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track commercial and residential rent collections, lease expiries, and maintenance in Peshawar
          </p>
        </div>
      </div>

      {/* Rentals Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rentList.map((rent) => (
          <div
            key={rent.id}
            className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4"
          >
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                  rent.status === 'active'
                    ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                    : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                }`}>
                  {rent.status.replace('_', ' ')}
                </span>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 mt-1">
                  {rent.propertyTitle}
                </h3>
                <p className="text-xs text-slate-500">{rent.location}</p>
              </div>

              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-slate-400">Monthly Rent</span>
                <p className="text-base font-black text-emerald-700 dark:text-emerald-400 tabular-nums">
                  {formatPKR(rent.monthlyRentPkr, language)}
                </p>
              </div>
            </div>

            {/* Tenant details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Tenant</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">{rent.tenantName}</p>
                <p className="text-[10px] text-slate-500 font-mono">{rent.tenantPhone}</p>
              </div>
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <span className="text-[10px] text-slate-400 uppercase font-semibold">Lease Period</span>
                <p className="font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                  {rent.leaseStart} to {rent.leaseEnd}
                </p>
                <p className="text-[10px] text-emerald-600 font-semibold">Due Day: {rent.rentDueDay} of month</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800 text-xs">
              <span className="text-[11px] text-slate-500">
                Last Cleared: {rent.lastPaymentDate}
              </span>

              <div className="flex items-center gap-2">
                <a
                  href={`https://wa.me/92${rent.tenantPhone.replace(/[^0-9]/g, '').slice(-10)}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum ${rent.tenantName} sahib, this is a reminder regarding monthly rent for ${rent.propertyTitle}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-emerald-600 hover:bg-slate-50"
                  title="WhatsApp"
                >
                  <MessageSquare className="w-4 h-4" />
                </a>

                <button
                  type="button"
                  onClick={() => handleMarkReceived(rent.id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Mark Rent Received
                </button>
              </div>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
