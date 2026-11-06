import React, { useState } from 'react';
import { Wallet, Plus, Coffee, Fuel, Megaphone, DollarSign, X } from 'lucide-react';
import { ExpenseItem, Language } from '../../types';
import { formatPKR } from '../../utils/formatters';

interface ExpensesViewProps {
  expenses: ExpenseItem[];
  onAddExpense: (expense: ExpenseItem) => void;
  language: Language;
}

export const ExpensesView: React.FC<ExpensesViewProps> = ({
  expenses,
  onAddExpense,
  language,
}) => {
  const [expenseList, setExpenseList] = useState<ExpenseItem[]>(expenses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<'office' | 'chai_refreshment' | 'fuel_travel' | 'marketing' | 'advance'>('chai_refreshment');
  const [amount, setAmount] = useState('5000');
  const [paidBy, setPaidBy] = useState('Imran Shah (Cashier)');

  const totalExpense = expenseList.reduce((acc, curr) => acc + curr.amountPkr, 0);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !amount) return;
    const newExp: ExpenseItem = {
      id: `exp-${Date.now()}`,
      title,
      category,
      amountPkr: Number(amount),
      date: new Date().toISOString().split('T')[0],
      paidBy,
    };
    onAddExpense(newExp);
    setExpenseList([newExp, ...expenseList]);
    setIsModalOpen(false);
    setTitle('');
  };

  const categoryIcons = {
    chai_refreshment: <Coffee className="w-4 h-4 text-amber-600" />,
    fuel_travel: <Fuel className="w-4 h-4 text-blue-600" />,
    marketing: <Megaphone className="w-4 h-4 text-purple-600" />,
    office: <Wallet className="w-4 h-4 text-emerald-600" />,
    advance: <DollarSign className="w-4 h-4 text-rose-600" />,
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Wallet className="w-5 h-5 text-emerald-600" />
            <span>Office Petty Cash & Operational Expenses</span>
          </h2>
          <p className="text-xs text-slate-500">
            Track daily dealer tea refreshments, site inspection fuel, marketing bills, and agent advances
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Record Expense</span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Total Monthly Expenses</span>
          <p className="text-2xl font-black text-rose-600 tabular-nums mt-1">
            {formatPKR(totalExpense, language)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">5 transactions recorded</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Guest Refreshments & Chai</span>
          <p className="text-2xl font-black text-amber-600 tabular-nums mt-1">
            {formatPKR(18500, language)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">Client hospitality in Peshawar</span>
        </div>

        <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <span className="text-[10px] font-bold uppercase text-slate-400">Fuel & Site Visits</span>
          <p className="text-2xl font-black text-blue-600 tabular-nums mt-1">
            {formatPKR(26000, language)}
          </p>
          <span className="text-[10px] text-slate-500 mt-1 block">DHA & Regi site inspection vans</span>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs text-xs">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
            Recent Expense Entries
          </h3>
          <span className="text-xs text-slate-500 font-mono">Cashier: Imran Shah</span>
        </div>

        <table className="w-full text-left">
          <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 uppercase text-[10px] border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="p-3">Expense Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Date</th>
              <th className="p-3">Paid By</th>
              <th className="p-3 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {expenseList.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <td className="p-3 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  {categoryIcons[exp.category]}
                  <span>{exp.title}</span>
                </td>
                <td className="p-3 text-slate-500 capitalize">{exp.category.replace('_', ' ')}</td>
                <td className="p-3 font-mono">{exp.date}</td>
                <td className="p-3 text-slate-600 dark:text-slate-400">{exp.paidBy}</td>
                <td className="p-3 text-right font-bold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatPKR(exp.amountPkr, language)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 w-full max-w-md p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Record Office Expense
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
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Description</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Office Green Tea & Biscuits for Client Delegation"
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  >
                    <option value="chai_refreshment">Chai / Refreshments</option>
                    <option value="fuel_travel">Fuel & Site Travel</option>
                    <option value="office">Office Utility & Rent</option>
                    <option value="marketing">Marketing & Digital Ads</option>
                    <option value="advance">Agent Advance</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Amount (PKR)</label>
                  <input
                    type="number"
                    step="100"
                    required
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1 text-slate-700 dark:text-slate-300">Paid Out By</label>
                <input
                  type="text"
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="w-full p-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-900"
                />
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
                  Save Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
