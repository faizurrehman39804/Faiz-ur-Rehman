import React, { useState } from 'react';
import { X, Sparkles, Plus, Trash2, Copy, Check, Tag } from 'lucide-react';
import { WishlistItem, Language } from '../types';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: WishlistItem[];
  onAddItem: (item: Omit<WishlistItem, 'id' | 'timestamp'>) => void;
  onDeleteItem: (id: string) => void;
  language: Language;
}

export const WishlistDrawer: React.FC<WishlistDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onAddItem,
  onDeleteItem,
  language,
}) => {
  const [text, setText] = useState('');
  const [category, setCategory] = useState<'feature' | 'pain_point' | 'customization' | 'pricing'>('feature');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    onAddItem({ text: text.trim(), category, priority });
    setText('');
  };

  const handleExport = () => {
    if (items.length === 0) return;
    const summary = items
      .map(
        (it, idx) =>
          `${idx + 1}. [${it.priority.toUpperCase()}] (${it.category.replace('_', ' ')}): ${it.text}`
      )
      .join('\n');
    const header = `=== PROPDESK DEALER MEETING WISHLIST ===\nTotal Items: ${items.length}\nDate: ${new Date().toLocaleDateString()}\n\n`;
    navigator.clipboard.writeText(header + summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const priorityColors = {
    high: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-950/80 dark:text-amber-300',
    low: 'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose} 
        aria-hidden="true" 
      />
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <aside aria-label="Feature Wishlist" className="w-screen max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                  Dealer Feature Wishlist
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Record requests & pain points live during meeting
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Input Form */}
          <form onSubmit={handleSubmit} className="p-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-800/20 space-y-3">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. 'Can we print receipts with Urdu stamp and agent signatures?'"
              rows={2}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              required
            />
            <div className="flex items-center justify-between gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value="feature">New Feature</option>
                <option value="pain_point">Pain Point</option>
                <option value="customization">Customization</option>
                <option value="pricing">Pricing / Commercial</option>
              </select>

              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="text-[11px] px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <button
                type="submit"
                className="flex items-center gap-1 px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-semibold shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>
          </form>

          {/* Items list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {items.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No items recorded yet. When the dealer asks for something custom, type it above to impress them!
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-start justify-between gap-2 hover:border-slate-300 dark:hover:border-slate-700 transition-colors"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <p className="text-xs text-slate-800 dark:text-slate-200 leading-normal">
                      {item.text}
                    </p>
                    <div className="flex items-center gap-2 text-[10px]">
                      <span className={`px-1.5 py-0.5 rounded font-semibold ${priorityColors[item.priority]}`}>
                        {item.priority.toUpperCase()}
                      </span>
                      <span className="text-slate-400 capitalize">
                        {item.category.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onDeleteItem(item.id)}
                    className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                    title="Delete item"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer with Export */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {items.length} items collected
            </span>
            <button
              type="button"
              onClick={handleExport}
              disabled={items.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied to Clipboard!' : 'Export Wishlist'}
            </button>
          </div>

        </aside>
      </div>
    </div>
  );
};
