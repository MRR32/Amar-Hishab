import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Wallet, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Bell, 
  User, 
  Eye, 
  EyeOff,
  Search,
  ChevronRight,
  Utensils,
  Bus,
  Receipt,
  ShoppingBag,
  MoreHorizontal,
  LogOut,
  Moon,
  Sun,
  X,
  Calendar,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useSettingsStore } from './store/settingsStore';
import { cn, formatCurrency, CATEGORIES } from './lib/utils';
import { translations, Language } from './lib/translations';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Button, Card, Input, Modal } from './components/UI';
import { Profile } from './components/Profile';

// --- Types ---
interface Expense {
  id: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  currency: string;
}

interface Loan {
  id: number;
  date: string;
  name: string;
  amount: number;
  expected_date?: string;
  return_date?: string;
  status: 'Pending' | 'Received' | 'Paid';
  currency: string;
}

interface Stats {
  monthlyExpenses: { currency: string; total: number }[];
  pendingLoansGiven: { currency: string; total: number }[];
  pendingLoansTaken: { currency: string; total: number }[];
}

// --- Components ---

// --- Pages ---

const Splash = ({ onFinish }: { onFinish: () => void }) => {
  const { language } = useSettingsStore();
  const t = translations[language];

  useEffect(() => {
    const timer = setTimeout(onFinish, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#1677FF] to-[#4096FF] flex flex-col items-center justify-center z-[100]">
      <motion.div 
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-24 h-24 bg-white rounded-3xl flex items-center justify-center shadow-2xl mb-6"
      >
        <Wallet className="text-[#1677FF]" size={48} />
      </motion.div>
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-white text-3xl font-bold tracking-tight"
      >
        {t.appName}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-white/70 mt-2 font-medium"
      >
        {language === 'bn' ? 'সহজ ও আধুনিক খরচ ট্র্যাকার' : 'Simple & Modern Expense Tracker'}
      </motion.p>
    </div>
  );
};

const Onboarding = ({ onFinish }: { onFinish: () => void }) => {
  const [step, setStep] = useState(0);
  const { language } = useSettingsStore();
  const t = translations[language];

  const slides = [
    { title: t.onboarding1Title, desc: t.onboarding1Desc, icon: Wallet },
    { title: t.onboarding2Title, desc: t.onboarding2Desc, icon: ArrowUpRight },
    { title: t.onboarding3Title, desc: t.onboarding3Desc, icon: LayoutDashboard },
  ];

  return (
    <div className="fixed inset-0 bg-white dark:bg-[#121212] flex flex-col p-8 z-[90] transition-colors">
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <motion.div 
          key={step}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="w-64 h-64 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-12"
        >
          {React.createElement(slides[step].icon, { size: 80, className: 'text-[#1677FF]' })}
        </motion.div>
        <motion.h2 
          key={`h2-${step}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-bold text-gray-900 dark:text-white mb-4"
        >
          {slides[step].title}
        </motion.h2>
        <motion.p 
          key={`p-${step}`}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-gray-500 dark:text-gray-400 leading-relaxed"
        >
          {slides[step].desc}
        </motion.p>
      </div>
      <div className="flex items-center justify-between mt-auto">
        <div className="flex gap-2">
          {slides.map((_, i) => (
            <div key={i} className={cn('h-2 rounded-full transition-all', i === step ? 'w-8 bg-[#1677FF]' : 'w-2 bg-gray-200 dark:bg-white/10')} />
          ))}
        </div>
        <Button onClick={() => step < slides.length - 1 ? setStep(step + 1) : onFinish()}>
          {step === slides.length - 1 ? t.start : t.next}
        </Button>
      </div>
    </div>
  );
};

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const setUser = useAuthStore(state => state.setUser);
  const { language, setLanguage } = useSettingsStore();
  const t = translations[language];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
    const body = isLogin ? { email, password } : { email, password, name };
    
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (data.success) {
      setUser(data.user);
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#121212] p-8 flex flex-col transition-colors">
      <div className="flex justify-end">
        <button 
          onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
          className="text-xs font-bold text-gray-400 bg-gray-50 dark:bg-white/5 px-3 py-1.5 rounded-full"
        >
          {language === 'bn' ? 'English' : 'বাংলা'}
        </button>
      </div>
      <div className="mt-8 mb-12">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{isLogin ? t.welcome : t.signup}</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">{isLogin ? t.loginDesc : t.signupDesc}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && <Input label={t.name} placeholder={language === 'bn' ? 'আপনার নাম' : 'Your Name'} value={name} onChange={e => setName(e.target.value)} required />}
        <Input label={t.email} type="email" placeholder="example@mail.com" value={email} onChange={e => setEmail(e.target.value)} required />
        <Input label={t.password} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
        <Button type="submit" className="w-full py-4 text-lg mt-4">
          {isLogin ? t.login : t.signup}
        </Button>
      </form>
      <div className="mt-auto text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-[#1677FF] font-semibold">
          {isLogin ? t.createAccount : t.alreadyHaveAccount}
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { language, setLanguage, isDarkMode, setDarkMode } = useSettingsStore();
  const t = translations[language];
  const [stats, setStats] = useState<Stats | null>(null);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loansGiven, setLoansGiven] = useState<Loan[]>([]);
  const [loansTaken, setLoansTaken] = useState<Loan[]>([]);
  const [showBalance, setShowBalance] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddLoanModalOpen, setIsAddLoanModalOpen] = useState(false);
  const [isAddReceivableModalOpen, setIsAddReceivableModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'expenses' | 'loans' | 'profile'>('dashboard');
  
  // Form states
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('BDT');
  const [category, setCategory] = useState('food');
  const [description, setDescription] = useState('');
  const [loanName, setLoanName] = useState('');
  const [expectedDate, setExpectedDate] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchData = async () => {
    if (!user) return;
    const [statsRes, expRes, lgRes, ltRes] = await Promise.all([
      fetch(`/api/stats/${user.id}`),
      fetch(`/api/expenses/${user.id}`),
      fetch(`/api/loans-given/${user.id}`),
      fetch(`/api/loans-taken/${user.id}`)
    ]);
    setStats(await statsRes.json());
    setExpenses(await expRes.json());
    setLoansGiven(await lgRes.json());
    setLoansTaken(await ltRes.json());
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await fetch('/api/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        date,
        description,
        category,
        amount: parseFloat(amount),
        currency
      }),
    });
    setIsAddModalOpen(false);
    resetForm();
    fetchData();
  };

  const handleAddLoan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await fetch('/api/loans-given', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        date,
        name: loanName,
        amount: parseFloat(amount),
        expected_date: expectedDate,
        currency
      }),
    });
    setIsAddLoanModalOpen(false);
    resetForm();
    fetchData();
  };

  const handleAddReceivable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    await fetch('/api/loans-taken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: user.id,
        date,
        name: loanName,
        amount: parseFloat(amount),
        return_date: expectedDate,
        currency
      }),
    });
    setIsAddReceivableModalOpen(false);
    resetForm();
    fetchData();
  };

  const updateLoanStatus = async (id: number, type: 'given' | 'taken', status: string) => {
    const endpoint = type === 'given' ? `/api/loans-given/${id}` : `/api/loans-taken/${id}`;
    await fetch(endpoint, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, return_date: new Date().toISOString().split('T')[0] }),
    });
    fetchData();
  };

  const resetForm = () => {
    setAmount('');
    setDescription('');
    setLoanName('');
    setExpectedDate('');
    setCurrency('BDT');
    setCategory('food');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const getStat = (list: { currency: string; total: number }[], curr: string) => {
    return list?.find(s => s.currency === curr)?.total || 0;
  };

  const netBalance = stats ? 
    (getStat(stats.pendingLoansGiven, 'BDT') - getStat(stats.pendingLoansTaken, 'BDT')) : 0;

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-gradient-to-br from-[#1677FF] to-[#4096FF] rounded-[32px] p-8 text-white shadow-2xl shadow-blue-500/40 relative overflow-hidden"
      >
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        
        <div className="flex justify-between items-start mb-8">
          <div>
            <p className="text-white/70 text-sm font-medium mb-1">{t.netBalance}</p>
            <div className="flex items-center gap-3">
              <h2 className="text-4xl font-bold">
                {showBalance ? formatCurrency(netBalance, 'BDT') : '••••••'}
              </h2>
              <button onClick={() => setShowBalance(!showBalance)} className="text-white/60">
                {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
            </div>
          </div>
          <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
            <Wallet size={24} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
          <div>
            <p className="text-white/60 text-xs mb-1">{t.monthlyExpense}</p>
            <p className="font-bold text-lg">{formatCurrency(getStat(stats?.monthlyExpenses || [], 'BDT'), 'BDT')}</p>
          </div>
          <div className="text-right">
            <p className="text-white/60 text-xs mb-1">{t.cnyExpense}</p>
            <p className="font-bold text-lg">{formatCurrency(getStat(stats?.monthlyExpenses || [], 'CNY'), 'CNY')}</p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Plus, label: t.expense, color: 'bg-blue-50 dark:bg-blue-900/20 text-blue-500', onClick: () => setIsAddModalOpen(true) },
          { icon: ArrowUpRight, label: t.loan, color: 'bg-green-50 dark:bg-green-900/20 text-green-500', onClick: () => setIsAddLoanModalOpen(true) },
          { icon: ArrowDownLeft, label: t.receivable, color: 'bg-orange-50 dark:bg-orange-900/20 text-orange-500', onClick: () => setIsAddReceivableModalOpen(true) },
          { icon: LayoutDashboard, label: t.report, color: 'bg-purple-50 dark:bg-purple-900/20 text-purple-500' },
        ].map((action, i) => (
          <button key={i} onClick={action.onClick} className="flex flex-col items-center gap-2">
            <div className={cn('w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm', action.color)}>
              <action.icon size={24} />
            </div>
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-xl flex items-center justify-center mb-3">
            <ArrowUpRight size={20} />
          </div>
          <p className="text-xs text-gray-400 font-medium mb-1">{t.pendingLoan}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(getStat(stats?.pendingLoansGiven || [], 'BDT'), 'BDT')}</p>
        </Card>
        <Card className="p-5">
          <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center mb-3">
            <ArrowDownLeft size={20} />
          </div>
          <p className="text-xs text-gray-400 font-medium mb-1">{t.pendingReceivable}</p>
          <p className="text-lg font-bold text-gray-900 dark:text-white">{formatCurrency(getStat(stats?.pendingLoansTaken || [], 'BDT'), 'BDT')}</p>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h4 className="font-bold text-gray-900 dark:text-white">{t.recentTransactions}</h4>
          <button onClick={() => setActiveTab('expenses')} className="text-xs text-[#1677FF] font-bold">{t.details}</button>
        </div>
        <div className="space-y-4">
          {expenses.slice(0, 5).map(exp => (
            <div key={exp.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-gray-400">
                  {React.createElement(
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'food' ? Utensils : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'transport' ? Bus : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'bills' ? Receipt : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'shopping' ? ShoppingBag : MoreHorizontal, 
                    { size: 20 }
                  )}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">{exp.description}</p>
                  <p className="text-[10px] text-gray-400 font-medium">{exp.date}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-red-500">-{formatCurrency(exp.amount, exp.currency)}</p>
            </div>
          ))}
          {expenses.length === 0 && <p className="text-center text-gray-400 text-sm py-4">{t.noData}</p>}
        </div>
      </Card>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{t.expense}</h2>
        <Button onClick={() => setIsAddModalOpen(true)} className="px-3 py-2"><Plus size={20} /></Button>
      </div>
      <div className="space-y-4">
        {expenses.map(exp => (
          <Card key={exp.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/20 text-[#1677FF] rounded-2xl flex items-center justify-center">
                  {React.createElement(
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'food' ? Utensils : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'transport' ? Bus : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'bills' ? Receipt : 
                    CATEGORIES.find(c => c.id === exp.category)?.id === 'shopping' ? ShoppingBag : MoreHorizontal, 
                    { size: 24 }
                  )}
                </div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white">{exp.description}</p>
                  <p className="text-xs text-gray-400 font-medium">{exp.date} • {t[exp.category as keyof typeof t]}</p>
                </div>
              </div>
              <p className="font-bold text-red-500">-{formatCurrency(exp.amount, exp.currency)}</p>
            </div>
          </Card>
        ))}
        {expenses.length === 0 && <p className="text-center text-gray-400 py-12">{t.noData}</p>}
      </div>
    </div>
  );

  const renderLoans = () => (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.loansGiven}</h3>
          <Button onClick={() => setIsAddLoanModalOpen(true)} variant="secondary" className="px-3 py-2"><Plus size={20} /></Button>
        </div>
        <div className="space-y-4">
          {loansGiven.map(loan => (
            <Card key={loan.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-50 dark:bg-green-900/20 text-green-500 rounded-xl flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{loan.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{loan.date}</p>
                  </div>
                </div>
                <p className="font-bold text-green-500">+{formatCurrency(loan.amount, loan.currency)}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold', loan.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' : 'bg-green-50 dark:bg-green-900/20 text-green-500')}>
                    {loan.status === 'Pending' ? t.pending : t.received}
                  </span>
                  {loan.expected_date && <span className="text-[10px] text-gray-400 font-medium">{t.expectedDate}: {loan.expected_date}</span>}
                </div>
                {loan.status === 'Pending' && (
                  <button onClick={() => updateLoanStatus(loan.id, 'given', 'Received')} className="text-xs font-bold text-[#1677FF]">
                    {t.markAsReceived}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.loansTaken}</h3>
          <Button onClick={() => setIsAddReceivableModalOpen(true)} variant="secondary" className="px-3 py-2"><Plus size={20} /></Button>
        </div>
        <div className="space-y-4">
          {loansTaken.map(loan => (
            <Card key={loan.id} className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-xl flex items-center justify-center">
                    <User size={20} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 dark:text-white">{loan.name}</p>
                    <p className="text-xs text-gray-400 font-medium">{loan.date}</p>
                  </div>
                </div>
                <p className="font-bold text-red-500">-{formatCurrency(loan.amount, loan.currency)}</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-50 dark:border-white/5">
                <div className="flex items-center gap-2">
                  <span className={cn('px-2 py-1 rounded-lg text-[10px] font-bold', loan.status === 'Pending' ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-500' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-500')}>
                    {loan.status === 'Pending' ? t.pending : t.paid}
                  </span>
                </div>
                {loan.status === 'Pending' && (
                  <button onClick={() => updateLoanStatus(loan.id, 'taken', 'Paid')} className="text-xs font-bold text-[#1677FF]">
                    {t.markAsPaid}
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );

  const renderProfile = () => (
    <Profile isDarkMode={isDarkMode} onToggleDarkMode={() => setDarkMode(!isDarkMode)} />
  );

  return (
    <div className="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] pb-24 transition-colors">
      {/* Header */}
      <div className="bg-white dark:bg-[#1F1F1F] px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-40 border-b border-gray-50 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-[#1677FF] font-bold">
            {user?.name[0]}
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium">{t.goodDay}</p>
            <h3 className="font-bold text-gray-900 dark:text-white">{user?.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
            className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-xs font-bold text-gray-400"
          >
            {language === 'bn' ? 'EN' : 'BN'}
          </button>
          <button className="p-2 bg-gray-50 dark:bg-white/5 rounded-full text-gray-400 relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1F1F1F]" />
          </button>
          <button onClick={logout} className="p-2 bg-red-50 dark:bg-red-500/10 rounded-full text-red-500">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'expenses' && renderExpenses()}
        {activeTab === 'loans' && renderLoans()}
        {activeTab === 'profile' && renderProfile()}
      </div>

      {/* Bottom Nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-[#1F1F1F]/80 backdrop-blur-lg border-t border-gray-100 dark:border-white/5 px-8 py-4 flex justify-between items-center z-40">
        <button onClick={() => setActiveTab('dashboard')} className={cn('flex flex-col items-center gap-1 transition-colors', activeTab === 'dashboard' ? 'text-[#1677FF]' : 'text-gray-400')}>
          <LayoutDashboard size={24} />
          <span className="text-[10px] font-bold">{t.home}</span>
        </button>
        <button onClick={() => setActiveTab('expenses')} className={cn('flex flex-col items-center gap-1 transition-colors', activeTab === 'expenses' ? 'text-[#1677FF]' : 'text-gray-400')}>
          <Wallet size={24} />
          <span className="text-[10px] font-bold">{t.expense}</span>
        </button>
        <div className="relative -top-8">
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="w-16 h-16 bg-[#1677FF] rounded-full flex items-center justify-center text-white shadow-xl shadow-blue-500/40 border-4 border-white dark:border-[#1F1F1F] active:scale-90 transition-transform"
          >
            <Plus size={32} />
          </button>
        </div>
        <button onClick={() => setActiveTab('loans')} className={cn('flex flex-col items-center gap-1 transition-colors', activeTab === 'loans' ? 'text-[#1677FF]' : 'text-gray-400')}>
          <ArrowUpRight size={24} />
          <span className="text-[10px] font-bold">{t.loan}</span>
        </button>
        <button onClick={() => setActiveTab('profile')} className={cn('flex flex-col items-center gap-1 transition-colors', activeTab === 'profile' ? 'text-[#1677FF]' : 'text-gray-400')}>
          <User size={24} />
          <span className="text-[10px] font-bold">{t.profile}</span>
        </button>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={t.addExpense}>
        <form onSubmit={handleAddExpense} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.amount}</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full text-4xl font-bold py-4 px-4 bg-gray-50 dark:bg-[#262626] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center text-gray-900 dark:text-white"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button 
                  type="button"
                  onClick={() => setCurrency('BDT')}
                  className={cn('px-3 py-1 rounded-lg text-xs font-bold transition-all', currency === 'BDT' ? 'bg-[#1677FF] text-white' : 'bg-white dark:bg-[#1F1F1F] text-gray-400 border border-gray-100 dark:border-white/5')}
                >
                  BDT
                </button>
                <button 
                  type="button"
                  onClick={() => setCurrency('CNY')}
                  className={cn('px-3 py-1 rounded-lg text-xs font-bold transition-all', currency === 'CNY' ? 'bg-[#1677FF] text-white' : 'bg-white dark:bg-[#1F1F1F] text-gray-400 border border-gray-100 dark:border-white/5')}
                >
                  CNY
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.category}</label>
            <div className="grid grid-cols-3 gap-3">
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all',
                    category === cat.id ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-500/50 text-[#1677FF]' : 'bg-white dark:bg-[#1F1F1F] border-gray-100 dark:border-white/5 text-gray-400'
                  )}
                >
                  {React.createElement(
                    cat.id === 'food' ? Utensils : 
                    cat.id === 'transport' ? Bus : 
                    cat.id === 'bills' ? Receipt : 
                    cat.id === 'shopping' ? ShoppingBag : MoreHorizontal, 
                    { size: 24 }
                  )}
                  <span className="text-xs font-bold">{t[cat.id as keyof typeof t]}</span>
                </button>
              ))}
            </div>
          </div>

          <Input label={t.description} placeholder={language === 'bn' ? 'কি জন্য খরচ করলেন?' : 'What was it for?'} value={description} onChange={e => setDescription(e.target.value)} required />
          <Input label={t.date} type="date" value={date} onChange={e => setDate(e.target.value)} required />

          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1 py-4" onClick={() => setIsAddModalOpen(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-[2] py-4">{t.save}</Button>
          </div>
        </form>
      </Modal>

      {/* Add Loan Modal */}
      <Modal isOpen={isAddLoanModalOpen} onClose={() => setIsAddLoanModalOpen(false)} title={t.addLoan}>
        <form onSubmit={handleAddLoan} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 ml-1">{t.amount}</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full text-4xl font-bold py-4 px-4 bg-gray-50 dark:bg-[#262626] rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center text-gray-900 dark:text-white"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button type="button" onClick={() => setCurrency('BDT')} className={cn('px-3 py-1 rounded-lg text-xs font-bold', currency === 'BDT' ? 'bg-[#1677FF] text-white' : 'bg-white text-gray-400 border border-gray-100')}>BDT</button>
                <button type="button" onClick={() => setCurrency('CNY')} className={cn('px-3 py-1 rounded-lg text-xs font-bold', currency === 'CNY' ? 'bg-[#1677FF] text-white' : 'bg-white text-gray-400 border border-gray-100')}>CNY</button>
              </div>
            </div>
          </div>
          <Input label={t.toWhom} placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'} value={loanName} onChange={e => setLoanName(e.target.value)} required />
          <Input label={t.expectedDate} type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} required />
          <Input label={t.date} type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1 py-4" onClick={() => setIsAddLoanModalOpen(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-[2] py-4">{t.save}</Button>
          </div>
        </form>
      </Modal>

      {/* Add Receivable Modal */}
      <Modal isOpen={isAddReceivableModalOpen} onClose={() => setIsAddReceivableModalOpen(false)} title={t.addReceivable}>
        <form onSubmit={handleAddReceivable} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">{t.amount}</label>
            <div className="relative">
              <input 
                type="number" 
                placeholder="0.00" 
                className="w-full text-4xl font-bold py-4 px-4 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-center"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <button type="button" onClick={() => setCurrency('BDT')} className={cn('px-3 py-1 rounded-lg text-xs font-bold', currency === 'BDT' ? 'bg-[#1677FF] text-white' : 'bg-white text-gray-400 border border-gray-100')}>BDT</button>
                <button type="button" onClick={() => setCurrency('CNY')} className={cn('px-3 py-1 rounded-lg text-xs font-bold', currency === 'CNY' ? 'bg-[#1677FF] text-white' : 'bg-white text-gray-400 border border-gray-100')}>CNY</button>
              </div>
            </div>
          </div>
          <Input label={t.fromWhom} placeholder={language === 'bn' ? 'নাম লিখুন' : 'Enter name'} value={loanName} onChange={e => setLoanName(e.target.value)} required />
          <Input label={t.expectedDate} type="date" value={expectedDate} onChange={e => setExpectedDate(e.target.value)} required />
          <Input label={t.date} type="date" value={date} onChange={e => setDate(e.target.value)} required />
          <div className="flex gap-4 pt-4">
            <Button type="button" variant="outline" className="flex-1 py-4" onClick={() => setIsAddReceivableModalOpen(false)}>{t.cancel}</Button>
            <Button type="submit" className="flex-[2] py-4">{t.save}</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const user = useAuthStore(state => state.user);
  const logout = useAuthStore(state => state.logout);
  const { isDarkMode } = useSettingsStore();

  useEffect(() => {
    const verifyUser = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/auth/verify/${user.id}`);
          if (!res.ok) {
            logout();
          }
        } catch (e) {
          console.error("Verification failed", e);
        }
      }
    };
    verifyUser();
  }, [user, logout]);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('hasSeenOnboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingFinish = () => {
    localStorage.setItem('hasSeenOnboarding', 'true');
    setShowOnboarding(false);
  };

  if (showSplash) return <Splash onFinish={() => setShowSplash(false)} />;
  if (showOnboarding) return <Onboarding onFinish={handleOnboardingFinish} />;
  if (!user) return <Auth />;

  return <Dashboard />;
}
