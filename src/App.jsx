import React, { useState, useMemo } from 'react';
import { 
  Heart, Settings, Zap, ChevronLeft, ArrowRight, 
  ShoppingCart, ShieldCheck, RefreshCw, X, TrendingUp, Award, Truck
} from 'lucide-react';

// --- ビジネスロジック設定 ---
const FEE_RATE = parseFloat(import.meta.env.VITE_PLATFORM_FEE_RATE) || 0.10;
const FIXED_FEE = parseInt(import.meta.env.VITE_SYSTEM_FIXED_FEE) || 300;

const calcSupportPrice = (price) => Math.floor(price * (1 + FEE_RATE)) + FIXED_FEE;

// --- 初期データ ---
const INITIAL_DATA = [
  {
    id: 1,
    name: "東京サッカーアカデミー",
    prefecture: "東京都",
    description: "次世代のJリーガーを育成中。練習用ボールを新調したいです！",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800",
    campaigns: [{ id: 101, asin: "B00X9S5Y6Y", name: "モルテン サッカーボール 5号球", amazonPrice: 5800, currentAmount: 0 }]
  },
  {
    id: 2,
    name: "品川ライオンズ",
    prefecture: "東京都",
    description: "地域密着型のバスケットボールチーム。遠征用ビブスを募集しています。",
    image: "https://images.unsplash.com/photo-1546519638-68711109e96d?w=800",
    campaigns: [{ id: 201, asin: "B0797S8W6X", name: "メッシュビブス 12枚セット", amazonPrice: 12500, currentAmount: 4500 }]
  }
];

export default function App() {
  const [teams, setTeams] = useState(INITIAL_DATA);
  const [view, setView] = useState('list');
  const [selected, setSelected] = useState(null);

  const handleSyncPrice = (id) => {
    setTeams(prev => prev.map(t => ({
      ...t, campaigns: t.campaigns.map(c => c.id === id ? { ...c, amazonPrice: c.amazonPrice + 100 } : c)
    })));
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center px-6 justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('list')}>
          <Zap className="w-6 h-6 text-blue-600 fill-current" />
          <span className="font-black text-xl tracking-tighter uppercase">Team-Gift</span>
        </div>
        <button onClick={() => setView('admin')} className="p-2 text-slate-400 hover:text-blue-600 transition">
          <Settings className="w-5 h-5" />
        </button>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        {view === 'list' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teams.flatMap(t => t.campaigns.map(c => (
              <div key={c.id} onClick={() => { setSelected({t, c}); setView('detail'); }} className="bg-white rounded-[2rem] border border-slate-200 overflow-hidden hover:shadow-xl transition-all cursor-pointer group">
                <img src={t.image} className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="p-6">
                  <span className="text-[10px] font-black bg-blue-600 text-white px-2 py-0.5 rounded uppercase mb-2 inline-block">{t.prefecture}</span>
                  <h3 className="font-black text-lg mb-1">{c.name}</h3>
                  <p className="text-sm text-slate-500 font-bold mb-4">{t.name}</p>
                  <div className="bg-slate-50 p-4 rounded-2xl flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-400 uppercase">Target</span>
                    <span className="font-black text-blue-600 text-xl">¥{calcSupportPrice(c.amazonPrice).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            )))}
          </div>
        )}

        {view === 'detail' && (
          <div className="max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4">
            <button onClick={() => setView('list')} className="flex items-center gap-2 font-bold text-slate-400 mb-8"><ChevronLeft /> 戻る</button>
            <div className="grid md:grid-cols-2 gap-12">
              <img src={selected.t.image} className="rounded-[2.5rem] shadow-2xl sticky top-24" />
              <div className="space-y-8">
                <div>
                  <h1 className="text-4xl font-black mb-4">{selected.c.name}</h1>
                  <p className="text-slate-500 font-bold leading-relaxed">{selected.t.description}</p>
                </div>
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-xl shadow-blue-500/5 space-y-4">
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-1"><ShoppingCart className="w-4 h-4" /> Amazon価格</span>
                    <span>¥{selected.c.amazonPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-slate-400">
                    <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> システム・配送手数料</span>
                    <span>+ ¥{(calcSupportPrice(selected.c.amazonPrice) - selected.c.amazonPrice).toLocaleString()}</span>
                  </div>
                  <div className="h-px bg-slate-100" />
                  <div className="flex justify-between items-end">
                    <span className="font-black text-slate-900 text-lg">一口支援金額</span>
                    <span className="text-4xl font-black text-blue-600 italic">¥{calcSupportPrice(selected.c.amazonPrice).toLocaleString()}</span>
                  </div>
                  <button className="w-full bg-slate-900 text-white font-black py-6 rounded-2xl shadow-xl hover:bg-blue-600 transition-all flex items-center justify-center gap-3 text-xl">
                    支援を確定する <ArrowRight />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'admin' && (
          <div className="fixed inset-0 bg-slate-900 z-[60] p-10 text-white overflow-y-auto">
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-3xl font-black tracking-tighter italic">ADMIN PANEL</h2>
                <button onClick={() => setView('list')} className="p-3 bg-white/10 rounded-full hover:bg-white/20 transition"><X /></button>
              </div>
              <div className="grid grid-cols-2 gap-6 mb-12">
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                  <p className="text-slate-400 font-bold text-xs uppercase mb-1">Total Support</p>
                  <p className="text-3xl font-black">¥4,500</p>
                </div>
                <div className="bg-blue-600 p-6 rounded-3xl shadow-lg shadow-blue-500/20">
                  <p className="text-blue-100 font-bold text-xs uppercase mb-1">Total Profit</p>
                  <p className="text-3xl font-black">¥540</p>
                </div>
              </div>
              <div className="space-y-4">
                {teams.flatMap(t => t.campaigns.map(c => (
                  <div key={c.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between group hover:border-blue-500/50 transition">
                    <div>
                      <p className="font-black">{c.name}</p>
                      <p className="text-xs text-slate-400 font-mono tracking-widest mt-1">ASIN: {c.asin} | ¥{c.amazonPrice.toLocaleString()}</p>
                    </div>
                    <button onClick={() => handleSyncPrice(c.id)} className="p-4 bg-white/10 rounded-xl hover:bg-white/20 transition text-blue-400">
                      <RefreshCw className="w-5 h-5" />
                    </button>
                  </div>
                )))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
