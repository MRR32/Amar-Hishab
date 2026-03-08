import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '../lib/utils';

export const Button = ({ className, variant = 'primary', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' }) => {
  const variants = {
    primary: 'bg-gradient-to-r from-[#1677FF] to-[#4096FF] text-white shadow-lg shadow-blue-500/30',
    secondary: 'bg-[#1890FF]/10 text-[#1890FF]',
    outline: 'border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-white/10 dark:text-gray-300 dark:hover:bg-white/5',
    ghost: 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5',
    danger: 'bg-red-50 text-red-500 border border-red-100 dark:bg-red-500/10 dark:border-red-500/20',
  };
  return (
    <button 
      className={cn('px-4 py-2 rounded-2xl font-medium transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2', variants[variant], className)}
      {...props}
    />
  );
};

export const Card = ({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div 
    className={cn('bg-white dark:bg-[#1F1F1F] rounded-[24px] p-6 shadow-sm border border-gray-100 dark:border-white/5', className)}
    {...props}
  >
    {children}
  </div>
);

export const Input = ({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label?: string }) => (
  <div className="space-y-1.5">
    {label && <label className="text-sm font-medium text-gray-700 dark:text-gray-300 ml-1">{label}</label>}
    <input 
      className="w-full px-4 py-3 rounded-2xl bg-gray-50 dark:bg-[#262626] border border-gray-100 dark:border-white/5 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
      {...props}
    />
  </div>
);

export const Modal = ({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) => (
  <AnimatePresence>
    {isOpen && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
        />
        <motion.div 
          initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed bottom-0 left-0 right-0 bg-white dark:bg-[#1F1F1F] rounded-t-[32px] p-6 z-50 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <button onClick={onClose} className="p-2 bg-gray-100 dark:bg-white/5 rounded-full text-gray-500 dark:text-gray-400"><X size={20} /></button>
          </div>
          {children}
        </motion.div>
      </>
    )}
  </AnimatePresence>
);
