import React, { useState } from 'react';
import { Users, Shield, Plus, Check, X, Lock } from 'lucide-react';
import { StaffMember, UserRole, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface TeamViewProps {
  staff: StaffMember[];
  onAddStaff: (member: StaffMember) => void;
  language: Language;
}

export const TeamView: React.FC<TeamViewProps> = ({
  staff,
  onAddStaff,
  language,
}) => {
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('0300-');
  const [role, setRole] = useState<UserRole>('agent');
  const [target, setTarget] = useState('15000000');

  const permissionsMatrix = [
    { feature: 'View Dashboard & KPIs', owner: true, manager: true, agent: true, accountant: true },
    { feature: 'Leads CRM Pipeline & Drag-Drop', owner: true, manager: true, agent: true, accountant: false },
    { feature: 'Add & Edit Property Inventory', owner: true, manager: true, agent: true, accountant: false },
    { feature: 'View Direct Owner Phone & Contacts', owner: true, manager: true, agent: false, accountant: false },
    { feature: 'Record Payments & Issue Receipts', owner: true, manager: true, agent: false, accountant: true },
    { feature: 'Void Payment Entries with Reason', owner: true, manager: false, agent: false, accountant: false },
    { feature: 'View Total Deal Commissions & Splits', owner: true, manager: true, agent: false, accountant: true },
    { feature: 'Office Expenses & Cash Ledger', owner: true, manager: true, agent: false, accountant: true },
    { feature: 'Manage Staff Roster & System Settings', owner: true, manager: false, agent: false, accountant: false },
  ];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;
    const newMember: StaffMember = {
      id: `staff-${Date.now()}`,
      name,
      role,
      phone,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@propdesk.pk`,
      activeDealsCount: 0,
      monthlyTargetPkr: Number(target) || 10000000,
      achievedPkr: 0,
    };
    onAddStaff(newMember);
    setIsInviteOpen(false);
    setName('');
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            <span>Staff Roster & Role Permissions Matrix</span>
          </h2>
          <p className="text-xs text-slate-500">
            Control exactly what your agents and accountant see to protect confidential owners and revenue
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsInviteOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* Staff Roster Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {staff.map((m) => (
          <div
            key={m.id}
            className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">{m.name}</h3>
                <p className="text-xs text-slate-500 font-mono mt-0.5">{m.phone}</p>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded font-bold uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                {m.role}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Monthly Sales Target:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{formatPKR(m.monthlyTargetPkr, language)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>Achieved:</span>
                <span className="font-bold text-emerald-600">{formatPKR(m.achievedPkr, language)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Matrix */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-600" />
            Security & Access Control Matrix (RBAC)
          </h3>
          <span className="text-xs text-slate-500">Enforced by Top Bar Role Switcher</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="p-3">Feature & Data Privilege</th>
                <th className="p-3 text-center">Owner</th>
                <th className="p-3 text-center">General Manager</th>
                <th className="p-3 text-center">Sales Agent</th>
                <th className="p-3 text-center">Accountant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <td className="p-3 font-semibold text-slate-800 dark:text-slate-200">{row.feature}</td>
                  <td className="p-3 text-center">
                    {row.owner ? <Check className="w-4 h-4 mx-auto text-emerald-600" /> : <X className="w-4 h-4 mx-auto text-slate-300" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.manager ? <Check className="w-4 h-4 mx-auto text-emerald-600" /> : <X className="w-4 h-4 mx-auto text-slate-300" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.agent ? <Check className="w-4 h-4 mx-auto text-emerald-600" /> : <X className="w-4 h-4 mx-auto text-slate-300" />}
                  </td>
                  <td className="p-3 text-center">
                    {row.accountant ? <Check className="w-4 h-4 mx-auto text-emerald-600" /> : <X className="w-4 h-4 mx-auto text-slate-300" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Modal */}
      {isInviteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Add Team Member
              </h3>
              <button
                type="button"
                onClick={() => setIsInviteOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Asadullah Bangash"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="agent">Sales Agent</option>
                    <option value="manager">Manager</option>
                    <option value="accountant">Accountant</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Monthly Sales Target (PKR)</label>
                <input
                  type="number"
                  step="1000000"
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
