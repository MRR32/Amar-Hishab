import React from 'react';
import { 
  User, 
  Settings, 
  Shield, 
  Bell, 
  HelpCircle, 
  LogOut, 
  ChevronRight, 
  Moon, 
  Sun, 
  Download, 
  Share2,
  Globe
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Button } from './UI';
import { useAuthStore } from '../store/authStore';
import { useSettingsStore } from '../store/settingsStore';
import { translations } from '../lib/translations';
import { cn } from '../lib/utils';

interface ProfileProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Profile: React.FC<ProfileProps> = ({ isDarkMode, onToggleDarkMode }) => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { language, setLanguage } = useSettingsStore();
  const t = translations[language];

  const menuItems = [
    { id: 'personal', icon: User, label: t.personalInfo, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { id: 'security', icon: Shield, label: t.securityPrivacy, color: 'text-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
    { id: 'notifications', icon: Bell, label: t.notifications, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { id: 'export', icon: Download, label: t.exportData, color: 'text-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20' },
    { id: 'invite', icon: Share2, label: t.inviteFriends, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { id: 'help', icon: HelpCircle, label: t.helpSupport, color: 'text-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-24 px-4 pt-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">{t.profile}</h1>
        <button className="p-2 rounded-xl bg-white dark:bg-[#1F1F1F] shadow-sm border border-slate-100 dark:border-white/5">
          <Settings size={24} className="text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      {/* User Info Card */}
      <Card className="flex flex-col items-center text-center py-8">
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-[#1677FF] to-[#4096FF] rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20 mb-4">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="absolute bottom-4 right-0 w-8 h-8 bg-white dark:bg-[#1F1F1F] rounded-full border-4 border-[#FAFAFA] dark:border-[#121212] flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white">{user?.name}</h3>
        <p className="text-slate-500 dark:text-slate-400 text-sm">{user?.email}</p>
      </Card>

      {/* Settings Section */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{t.darkMode} & {t.language}</h4>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={onToggleDarkMode}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-all"
          >
            <div className={cn('p-2 rounded-xl', isDarkMode ? 'bg-orange-50 text-orange-500' : 'bg-blue-50 text-blue-500')}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{isDarkMode ? 'Light' : 'Dark'}</span>
          </button>
          <button 
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-all"
          >
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-500">
              <Globe size={20} />
            </div>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{language === 'bn' ? 'English' : 'বাংলা'}</span>
          </button>
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item) => (
          <button 
            key={item.id}
            className="w-full flex items-center justify-between p-4 rounded-2xl bg-white dark:bg-[#1F1F1F] border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className={cn('p-2.5 rounded-xl', item.bg, item.color)}>
                <item.icon size={20} />
              </div>
              <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{item.label}</span>
            </div>
            <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-400 transition-colors" />
          </button>
        ))}
      </div>

      {/* Logout Button */}
      <Button 
        variant="danger" 
        className="w-full py-4 rounded-2xl gap-3 shadow-none border-none mt-4"
        onClick={logout}
      >
        <LogOut size={20} />
        <span className="font-bold">{t.logout}</span>
      </Button>

      <div className="text-center pb-8">
        <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Version 1.0.0 • Made with ❤️</p>
      </div>
    </div>
  );
};
