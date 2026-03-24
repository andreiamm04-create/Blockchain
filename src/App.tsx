import React, { useState } from 'react';
import { 
  Factory, 
  LayoutDashboard, 
  Truck, 
  Database, 
  Activity, 
  ShieldAlert, 
  Map as MapIcon, 
  Settings, 
  Bell, 
  Search, 
  Terminal, 
  HelpCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Maximize2,
  Minus,
  Layers,
  ChevronRight,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { cn } from './lib/utils';

import { supabase } from './lib/supabase';

// --- Types ---
type Screen = 'dashboard' | 'supply-chain' | 'blockchain' | 'analytics' | 'logistics';

interface LedgerItem {
  height: string;
  timestamp: string;
  txns: number;
  hash: string;
  prev_hash: string;
  status: string;
  terminal: string;
  volume: number;
}

interface AnalyticsItem {
  label: string;
  production: number;
  distribution: number;
}

interface MarketMixItem {
  name: string;
  value: number;
  color: string;
}

// --- Components ---

const Sidebar = ({ activeScreen, setScreen }: { activeScreen: Screen, setScreen: (s: Screen) => void }) => {
  const navItems = [
    { id: 'dashboard', label: 'KPI Dashboard', icon: LayoutDashboard },
    { id: 'supply-chain', label: 'Supply Chain', icon: Truck },
    { id: 'blockchain', label: 'Blockchain Explorer', icon: Database },
    { id: 'logistics', label: 'Logistics & Fleet', icon: MapIcon },
    { id: 'analytics', label: 'KPI Analytics', icon: Activity },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-surface border-r border-white/5 flex flex-col z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary flex items-center justify-center">
            <Factory className="text-on-primary w-6 h-6" />
          </div>
          <div>
            <h1 className="text-primary font-headline font-black tracking-widest leading-none text-lg">FUELCHAIN</h1>
            <p className="font-headline uppercase tracking-tight text-[10px] font-bold text-slate-500">V2.0.4-INDUSTRIAL</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setScreen(item.id as Screen)}
            className={cn(
              "w-full flex items-center py-4 px-6 font-headline uppercase tracking-tight text-xs font-bold transition-all border-l-4",
              activeScreen === item.id 
                ? "text-primary border-primary bg-surface-container-low" 
                : "text-slate-500 border-transparent hover:bg-surface-container hover:text-white"
            )}
          >
            <item.icon className="mr-3 w-4 h-4" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-6">
        <button className="w-full bg-primary text-on-primary py-3 font-headline font-bold text-sm tracking-widest uppercase hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          NEW TRANSACTION
        </button>
      </div>

      <div className="border-t border-white/5 p-4">
        <button className="w-full flex items-center py-2 px-4 text-slate-500 font-headline uppercase tracking-tight text-[10px] font-bold hover:text-white transition-all">
          <Terminal className="mr-3 w-3 h-3" />
          System Logs
        </button>
        <button className="w-full flex items-center py-2 px-4 text-slate-500 font-headline uppercase tracking-tight text-[10px] font-bold hover:text-white transition-all">
          <HelpCircle className="mr-3 w-3 h-3" />
          Support
        </button>
      </div>
    </aside>
  );
};

const TopBar = ({ title }: { title: string }) => {
  return (
    <header className="h-16 border-b border-white/5 bg-surface/80 backdrop-blur-md sticky top-0 z-40 flex items-center justify-between px-8">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-primary animate-pulse rounded-full"></span>
          <span className="font-headline uppercase tracking-widest text-[10px] text-primary">SYSTEM_NODE: ACTIVE_081</span>
        </div>
        <div className="h-4 w-px bg-white/10"></div>
        <div className="text-primary font-headline font-bold text-sm tracking-tighter">NETWORK HEALTH: 99.98%</div>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-3 h-3" />
          <input 
            type="text" 
            placeholder="SEARCH LEDGER..." 
            className="bg-surface-container-low border-none text-[10px] font-headline tracking-widest text-white w-64 focus:ring-1 focus:ring-primary h-8 pl-9 pr-3"
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="text-slate-400 hover:text-primary transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <Settings className="w-5 h-5" />
          </button>
          <div className="w-8 h-8 bg-surface-container-high border border-white/10 overflow-hidden">
            <img 
              src="https://picsum.photos/seed/tech/100/100" 
              alt="User" 
              className="w-full h-full object-cover grayscale"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </div>
    </header>
  );
};

const Dashboard = ({ ledger }: { ledger: LedgerItem[] }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="col-span-2 bg-surface-container p-6 relative overflow-hidden group border-l-4 border-primary">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Factory className="w-16 h-16" />
          </div>
          <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-2">Total Barrels In Production</p>
          <h2 className="font-headline text-5xl font-black text-primary tracking-tighter">482,901</h2>
          <div className="mt-4 flex items-center gap-2 text-tertiary text-xs font-bold">
            <TrendingUp className="w-4 h-4" />
            <span>+4.2% FROM PREVIOUS CYCLE</span>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-1 bg-surface-container-high">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '72%' }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="h-full bg-primary"
            ></motion.div>
          </div>
        </div>
        
        <div className="bg-surface-container-low p-6 flex flex-col justify-between border-l-2 border-primary/20">
          <div>
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">In Transit</p>
            <h3 className="font-headline text-3xl font-bold text-white">128,440</h3>
          </div>
          <div className="text-[10px] font-mono text-slate-500 mt-4 space-y-1">
            <div className="flex justify-between"><span>MARITIME:</span> <span className="text-white">82k</span></div>
            <div className="flex justify-between"><span>PIPELINE:</span> <span className="text-white">46k</span></div>
          </div>
        </div>

        <div className="bg-surface-container-low p-6 flex flex-col justify-between border-l-2 border-tertiary/20">
          <div>
            <p className="font-headline text-[10px] uppercase tracking-[0.2em] text-slate-400 mb-1">Retail Inventory</p>
            <h3 className="font-headline text-3xl font-bold text-white">64,120</h3>
          </div>
          <div className="flex items-end h-8 gap-1">
            {[40, 60, 30, 80, 55].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className="w-full bg-tertiary/30"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Throughput', value: '12.4K', unit: 'BBL/H' },
              { label: 'Efficiency', value: '94.8', unit: '%' },
              { label: 'Nodes Online', value: '1,024', unit: '' },
            ].map((stat, i) => (
              <div key={i} className="bg-surface-container-high p-5">
                <p className="text-[10px] font-headline font-bold text-slate-500 tracking-widest uppercase">{stat.label}</p>
                <div className="text-2xl font-headline font-black mt-1">
                  {stat.value} <span className="text-xs font-normal text-slate-500">{stat.unit}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-surface-container overflow-hidden">
            <div className="p-4 bg-surface-container-high flex justify-between items-center border-b border-white/5">
              <h4 className="font-headline font-bold text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                <ShieldAlert className="text-primary w-4 h-4" />
                LIVE LEDGER FEED
              </h4>
              <span className="text-[10px] font-mono text-primary animate-pulse">SYNCING...</span>
            </div>
            <div className="divide-y divide-white/5">
              {ledger.slice(0, 4).map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between group hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-surface-container-lowest font-mono text-[10px] text-tertiary">#{item.height.slice(-5)}</div>
                    <div>
                      <p className="font-mono text-xs text-white truncate w-64">{item.hash}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Verified: {item.terminal}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-mono text-slate-400">{new Date(item.timestamp).toLocaleTimeString()}</p>
                    <div className="text-[10px] text-primary font-bold">+{item.volume.toLocaleString()} BBL</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-surface-container-lowest font-headline text-[10px] font-bold tracking-[0.3em] uppercase text-slate-500 hover:text-white transition-colors">
              VIEW COMPLETE LEDGER
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-low border-l-4 border-error overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-error/10">
              <h4 className="font-headline font-black text-xs text-error tracking-widest uppercase">QUALITY ANOMALIES</h4>
              <span className="w-2 h-2 bg-error rounded-full animate-ping"></span>
            </div>
            <div className="p-4 space-y-4">
              <div className="bg-error/10 p-3 relative border border-error/20">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-headline font-black text-error uppercase">CRITICAL: BATCH_ERR_09</span>
                  <span className="text-[9px] font-mono text-slate-500">10:42 AM</span>
                </div>
                <p className="text-xs text-slate-300 mb-3 leading-relaxed">Sulphur content deviation detected at Terminal 4. Batch ID: #TX-992-B. Potential contamination.</p>
                <button className="w-full bg-error text-on-primary py-2 text-[10px] font-bold uppercase tracking-widest hover:opacity-90">INITIATE LOCKDOWN</button>
              </div>
              <div className="bg-surface-container-high p-3 border-l-2 border-primary">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-[10px] font-headline font-bold text-primary uppercase">WARNING: TEMP_SPIKE</span>
                  <span className="text-[9px] font-mono text-slate-500">09:15 AM</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Vessel 'Northern Star' reporting temperature threshold breach in sector 3.</p>
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low aspect-square relative group overflow-hidden">
            <img 
              src="https://picsum.photos/seed/map/400/400" 
              alt="Map" 
              className="w-full h-full object-cover grayscale opacity-40 group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4 right-4">
              <p className="font-headline text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase mb-1">Active Routes</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-surface-container-high">
                  <div className="h-full bg-primary w-2/3"></div>
                </div>
                <span className="font-mono text-[10px] text-white">67/82</span>
              </div>
            </div>
            <div className="absolute top-4 left-4 bg-surface/80 backdrop-blur-md px-3 py-1 text-[10px] font-headline font-bold uppercase tracking-widest border border-white/10">
              LIVE_TRAFFIC
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SupplyChain = ({ ledger }: { ledger: LedgerItem[] }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-white">SUPPLY CHAIN <span className="text-primary">FLOW</span></h1>
          <p className="text-slate-500 font-headline text-[10px] uppercase tracking-widest mt-2">END-TO-END BLOCKCHAIN TRACEABILITY & CUSTODY CHAIN</p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low p-3 border border-white/5">
          <div className="text-right">
            <div className="text-[9px] font-headline text-slate-500 uppercase">Active Batches</div>
            <div className="text-sm font-bold font-headline">1,284 UNITS</div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="text-right">
            <div className="text-[9px] font-headline text-slate-500 uppercase">Avg. Transit Time</div>
            <div className="text-sm font-bold font-headline">42.8 HRS</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-8">
          <div className="bg-surface-container-low p-8 relative overflow-hidden industrial-grid">
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-12">
              {[
                { label: 'Extraction', icon: Factory, status: 'completed', time: '08:12' },
                { label: 'Refinery', icon: Database, status: 'completed', time: '12:45' },
                { label: 'Transit', icon: Truck, status: 'active', time: 'NOW' },
                { label: 'Terminal', icon: Terminal, status: 'pending', time: 'ETA 18:00' },
              ].map((step, i, arr) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-4 relative z-10">
                    <div className={cn(
                      "w-16 h-16 flex items-center justify-center border-2 transition-all duration-500",
                      step.status === 'completed' ? "bg-primary border-primary text-on-primary" :
                      step.status === 'active' ? "bg-surface border-primary text-primary animate-pulse" :
                      "bg-surface border-white/10 text-slate-600"
                    )}>
                      <step.icon className="w-8 h-8" />
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] font-headline font-black uppercase tracking-widest text-white">{step.label}</div>
                      <div className="text-[9px] font-mono text-slate-500">{step.time}</div>
                    </div>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="hidden md:block flex-1 h-0.5 bg-white/10 relative">
                      {step.status === 'completed' && (
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          className="absolute inset-0 bg-primary"
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          <div className="bg-surface-container overflow-hidden">
            <div className="p-4 bg-surface-container-high flex justify-between items-center border-b border-white/5">
              <h4 className="font-headline font-bold text-xs tracking-[0.2em] uppercase">Active Custody Transfers</h4>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 bg-primary/10 text-primary text-[9px] font-bold uppercase">42 Verified</span>
                <span className="px-2 py-0.5 bg-tertiary/10 text-tertiary text-[9px] font-bold uppercase">3 Pending</span>
              </div>
            </div>
            <div className="divide-y divide-white/5">
              {ledger.slice(0, 6).map((item, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                  <div className="flex items-center gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-2 h-2 rounded-full bg-primary mb-1"></div>
                      <div className="w-0.5 h-8 bg-white/10"></div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-headline font-black text-white uppercase">{item.terminal}</span>
                        <ChevronRight className="w-3 h-3 text-slate-600" />
                        <span className="text-[10px] font-headline font-black text-primary uppercase">MAIN_HUB_01</span>
                      </div>
                      <div className="text-[10px] font-mono text-slate-500 mt-1">HASH: {item.hash.slice(0, 24)}...</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-headline font-black text-white">{item.volume.toLocaleString()} BBL</div>
                    <div className="text-[9px] font-headline font-bold text-slate-500 uppercase tracking-tighter">Verified: {new Date(item.timestamp).toLocaleDateString()}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-surface-container-low p-6 border-t-4 border-tertiary">
            <h4 className="font-headline font-black text-xs text-tertiary tracking-widest uppercase mb-6">Compliance Status</h4>
            <div className="space-y-6">
              {[
                { label: 'Environmental', value: 98 },
                { label: 'Safety Protocols', value: 100 },
                { label: 'Quality Control', value: 94 },
                { label: 'Blockchain Sync', value: 100 },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between text-[10px] font-headline font-bold uppercase mb-2">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="text-white">{item.value}%</span>
                  </div>
                  <div className="h-1 bg-surface-container-lowest">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      className={cn(
                        "h-full",
                        item.value === 100 ? "bg-tertiary" : "bg-primary"
                      )}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-surface-container p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <ShieldAlert className="w-24 h-24" />
            </div>
            <h4 className="font-headline font-black text-xs text-white tracking-widest uppercase mb-4">Audit Summary</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed mb-6">
              All transactions in the current cycle have been cryptographically signed and verified by 1,024 independent nodes. No unauthorized tampering detected.
            </p>
            <div className="flex items-center gap-3 p-3 bg-surface-container-lowest border border-white/5">
              <CheckCircle2 className="text-tertiary w-5 h-5" />
              <div>
                <div className="text-[10px] font-headline font-black text-white uppercase">Certificate #882-A</div>
                <div className="text-[9px] font-mono text-slate-500">VALID UNTIL: 2024.12.31</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MapScreen = ({ ledger }: { ledger: LedgerItem[] }) => {
  return (
    <div className="flex-1 flex overflow-hidden relative h-[calc(100vh-64px)]">
      <section className="flex-1 bg-surface-container-lowest relative industrial-grid overflow-hidden">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://picsum.photos/seed/world/1200/800" 
            alt="World Map" 
            className="w-full h-full object-cover grayscale invert"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="absolute top-6 left-6 z-10 space-y-2">
          <div className="bg-surface/80 backdrop-blur-md p-3 border-l-2 border-primary">
            <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase">System Status</div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
              <span className="text-xs font-bold font-headline tracking-tighter">NETWORK SYNCHRONIZED</span>
            </div>
          </div>
          <div className="bg-surface/80 backdrop-blur-md p-3 border-l-2 border-tertiary">
            <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase">Active Tankers</div>
            <div className="text-xs font-bold font-headline tracking-tighter">{ledger.length * 12} UNITS</div>
          </div>
        </div>

        {/* Animated Markers */}
        {ledger.slice(0, 3).map((item, i) => (
          <div key={i} className="absolute group" style={{ top: `${20 + i * 15}%`, left: `${15 + i * 20}%` }}>
            <div className="w-4 h-4 bg-primary flex items-center justify-center cursor-pointer pulse-red">
              <div className="w-1 h-1 bg-on-primary"></div>
            </div>
            <div className="absolute top-6 left-0 bg-surface border border-white/10 p-2 whitespace-nowrap hidden group-hover:block z-20">
              <div className="text-[9px] text-slate-500 font-headline uppercase">{item.terminal}</div>
              <div className="text-[11px] font-bold text-primary">STATUS: {item.status.toUpperCase()}</div>
              <div className="text-[9px] text-slate-400">VOL: {item.volume} BBL</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-6 right-6 flex flex-col gap-2">
          <button className="w-10 h-10 bg-surface-container-high flex items-center justify-center text-white hover:bg-primary hover:text-on-primary transition-all">
            <Plus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-surface-container-high flex items-center justify-center text-white hover:bg-primary hover:text-on-primary transition-all">
            <Minus className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-surface-container-high flex items-center justify-center text-white hover:bg-primary hover:text-on-primary transition-all">
            <Layers className="w-5 h-5" />
          </button>
        </div>
      </section>

      <aside className="w-96 bg-surface-container-low flex flex-col border-l border-white/5 z-10">
        <div className="p-6 border-b border-white/10">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-black font-headline tracking-tighter text-white">BATCH DETAILS</h2>
            <span className="bg-primary/20 text-primary px-2 py-0.5 text-[10px] font-headline font-bold uppercase tracking-widest">In Transit</span>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase mb-1">Blockchain Hash</div>
              <div className="bg-surface-container-lowest p-3 font-mono text-[11px] text-tertiary break-all flex justify-between items-center group">
                {ledger[0]?.hash || '0x4f2e91a0c83d72b...9a41'}
                <Copy className="w-3 h-3 cursor-pointer opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-surface-container-high p-4">
              <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase mb-1">Volume</div>
              <div className="text-xl font-bold font-headline">{ledger[0]?.volume.toLocaleString() || '42,000'} <span className="text-xs text-slate-400">BBL</span></div>
            </div>
            <div className="bg-surface-container-high p-4">
              <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase mb-1">Terminal</div>
              <div className="text-xl font-bold font-headline">{ledger[0]?.terminal || 'HOUSTON'}</div>
            </div>
          </div>

          <div className="relative pl-6 space-y-8">
            <div className="absolute left-1.5 top-2 bottom-2 w-0.5 bg-white/10"></div>
            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-3 h-3 bg-tertiary"></div>
              <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase">Origin Site</div>
              <div className="text-sm font-bold font-headline">HOUSTON TERMINAL - A4</div>
              <div className="text-[10px] text-slate-400">Timestamp: 2023.10.24 08:12:01 UTC</div>
            </div>
            <div className="relative">
              <div className="absolute -left-[22px] top-1 w-3 h-3 border-2 border-primary animate-pulse"></div>
              <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase">Current Position</div>
              <div className="text-sm font-bold font-headline">GULF OF MEXICO - TRANSIT</div>
              <div className="text-[10px] text-primary">Alert: High Seas Delay Expected</div>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10">
            <div className="text-[10px] font-headline tracking-widest text-slate-500 uppercase mb-4">Real-time Telemetry</div>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Temp Control</span>
                <span className="font-headline font-bold text-green-400">NORMAL [68°F]</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Seal Integrity</span>
                <span className="font-headline font-bold text-tertiary">VERIFIED</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Pressure</span>
                <span className="font-headline font-bold">14.7 PSI</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 bg-surface-container-high">
          <button className="w-full py-4 border-2 border-primary text-primary font-headline font-bold text-xs tracking-widest uppercase hover:bg-primary hover:text-on-primary transition-all">
            View Full Audit Trail
          </button>
        </div>
      </aside>
    </div>
  );
};

const BlockchainExplorer = ({ ledger }: { ledger: LedgerItem[] }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="grid grid-cols-4 gap-0 border-l-4 border-primary">
        {[
          { label: 'Network Status', value: 'SYNCHRONIZED', color: 'text-primary' },
          { label: 'Latest Block', value: ledger[0]?.height || '#0,000,000' },
          { label: 'Avg. Block Time', value: '2.4', unit: 'SEC' },
          { label: 'Active Nodes', value: '1,024' },
        ].map((stat, i) => (
          <div key={i} className="bg-surface-container-low p-6 border-r border-white/5">
            <p className="font-headline text-[10px] uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
            <div className="flex items-end gap-2">
              <h2 className={cn("text-3xl font-headline font-black", stat.color)}>{stat.value}</h2>
              {stat.unit && <span className="text-sm font-normal text-slate-500 mb-2 ml-1">{stat.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-grow bg-surface-container-lowest">
          <div className="flex items-center justify-between p-4 bg-surface-container border-b border-white/10">
            <div className="flex items-center gap-3">
              <Database className="text-primary w-4 h-4" />
              <h3 className="font-headline font-bold uppercase tracking-widest text-sm">Real-Time Ledger Stream</h3>
            </div>
            <span className="text-[10px] font-headline text-slate-500 tracking-[0.2em]">UPDATED: {new Date().toLocaleTimeString()} UTC</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-headline uppercase tracking-widest text-slate-500">
                  <th className="px-6 py-4">Height</th>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Txns</th>
                  <th className="px-6 py-4">Block Hash</th>
                  <th className="px-6 py-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {ledger.map((block, i) => (
                  <tr key={i} className="hover:bg-surface-container transition-colors group cursor-pointer">
                    <td className="px-6 py-4 font-headline font-bold text-primary">{block.height}</td>
                    <td className="px-6 py-4 text-xs font-mono text-slate-400">{new Date(block.timestamp).toLocaleTimeString()}</td>
                    <td className="px-6 py-4 text-xs font-bold">{block.txns}</td>
                    <td className="px-6 py-4 font-mono text-[10px] text-slate-300">{block.hash}</td>
                    <td className="px-6 py-4 text-right">
                      <span className={cn(
                        "px-2 py-0.5 text-[10px] font-headline font-black uppercase",
                        block.status === 'verified' ? "bg-primary/10 text-primary" : "bg-tertiary/10 text-tertiary"
                      )}>
                        {block.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="w-full lg:w-96 flex flex-col gap-6">
          <div className="bg-surface-container p-6 border-t-4 border-primary shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h4 className="font-headline font-black text-lg uppercase tracking-tight">Block Detail</h4>
              <Maximize2 className="text-primary w-5 h-5" />
            </div>
            <div className="space-y-6">
              <div>
                <p className="text-[10px] font-headline uppercase text-slate-500 tracking-widest mb-1">Merkle Root</p>
                <div className="bg-surface-container-lowest p-3 font-mono text-[10px] text-primary break-all leading-relaxed">
                  f2a39c94b293848576e1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-high p-4">
                  <p className="text-[9px] font-headline uppercase text-slate-500 tracking-widest mb-1">Nonce</p>
                  <p className="font-headline font-bold text-sm">2,841,922,014</p>
                </div>
                <div className="bg-surface-container-high p-4">
                  <p className="text-[9px] font-headline uppercase text-slate-500 tracking-widest mb-1">Size</p>
                  <p className="font-headline font-bold text-sm">48.2 KB</p>
                </div>
              </div>
              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] font-headline uppercase text-slate-500 tracking-widest mb-3">Validation Proof</p>
                <div className="flex items-center gap-4">
                  <div className="w-full bg-surface-container-lowest h-2">
                    <div className="bg-primary h-full w-[85%]"></div>
                  </div>
                  <span className="text-xs font-headline font-bold text-primary">85%</span>
                </div>
              </div>
              <button className="w-full border border-primary text-primary py-4 font-headline font-black uppercase text-xs tracking-[0.2em] hover:bg-primary hover:text-on-primary transition-all">
                VIEW JSON RAW DATA
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Analytics = ({ analyticsData, marketMix }: { analyticsData: AnalyticsItem[], marketMix: MarketMixItem[] }) => {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black font-headline tracking-tighter text-white">KPI ANALYTICS <span className="text-primary">HUB</span></h1>
          <p className="text-slate-500 font-headline text-[10px] uppercase tracking-widest mt-2">REAL-TIME BLOCKCHAIN VERIFIED PERFORMANCE METRICS</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-white/10 hover:bg-surface-bright transition-all text-[10px] font-headline font-bold tracking-widest uppercase">
            EXPORT PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-surface-container-high border border-white/10 hover:bg-surface-bright transition-all text-[10px] font-headline font-bold tracking-widest uppercase">
            EXPORT CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Gross Revenue', value: '$4,892,102.50', delta: '+12.4%', icon: TrendingUp, color: 'border-primary' },
          { label: 'Fuel Volume', value: '1,204,500 G', delta: '-2.1%', icon: TrendingDown, color: 'border-tertiary' },
          { label: 'Smart Contract Ops', value: '82,401', delta: '+45.8%', icon: TrendingUp, color: 'border-slate-700' },
          { label: 'Fleet Efficiency', value: '94.2%', delta: '+0.5%', icon: TrendingUp, color: 'border-white/20' },
        ].map((card, i) => (
          <div key={i} className={cn("bg-surface-container-low p-6 border-l-4", card.color)}>
            <div className="flex justify-between items-start mb-4">
              <span className="text-[10px] font-headline font-bold tracking-widest text-slate-500 uppercase">{card.label}</span>
              <card.icon className="text-slate-400 w-5 h-5" />
            </div>
            <div className="text-2xl font-black font-headline tracking-tighter text-white">{card.value}</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-primary text-[10px] font-bold font-headline bg-primary/10 px-2 py-0.5">{card.delta}</span>
              <span className="text-slate-600 text-[10px] font-headline uppercase tracking-tighter">vs. last month</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-surface-container p-8">
          <h3 className="text-sm font-black font-headline tracking-widest uppercase text-white mb-8">Production vs Distribution Trend</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsData}>
                <defs>
                  <linearGradient id="colorProd" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ffb4a8" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#ffb4a8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#353534" vertical={false} />
                <XAxis dataKey="label" stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#666" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1c1b1b', border: '1px solid #353534' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="production" stroke="#ffb4a8" fillOpacity={1} fill="url(#colorProd)" strokeWidth={3} />
                <Area type="monotone" dataKey="distribution" stroke="#acc7ff" fill="transparent" strokeDasharray="5 5" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-surface-container p-8 flex flex-col">
          <h3 className="text-sm font-black font-headline tracking-widest uppercase text-white mb-8">Fuel Type Market Mix</h3>
          <div className="flex-1 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={marketMix}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {marketMix.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-8 space-y-3">
            {marketMix.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3" style={{ backgroundColor: item.color }}></div>
                  <span className="text-[10px] font-headline text-slate-300 uppercase">{item.name}</span>
                </div>
                <span className="text-[10px] font-bold text-white">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeScreen, setScreen] = useState<Screen>('dashboard');
  const [ledger, setLedger] = useState<LedgerItem[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsItem[]>([]);
  const [marketMix, setMarketMix] = useState<MarketMixItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setError(null);
      const { data: ledgerData, error: ledgerError } = await supabase.from('ledger').select('*').order('timestamp', { ascending: false });
      const { data: analytics, error: analyticsError } = await supabase.from('analytics').select('*').order('created_at', { ascending: true });
      const { data: mix, error: mixError } = await supabase.from('market_mix').select('*');

      if (ledgerError || analyticsError || mixError) {
        const err = ledgerError || analyticsError || mixError;
        if (err?.code === 'PGRST116' || err?.message?.includes('relation') || err?.message?.includes('does not exist')) {
          setError('DATABASE_MIGRATION_REQUIRED: Please execute the supabase_migration.sql script in your Supabase SQL Editor.');
        } else {
          setError(`DATABASE_ERROR: ${err?.message || 'Unknown error'}`);
        }
        return;
      }

      if (ledgerData) setLedger(ledgerData);
      if (analytics) setAnalyticsData(analytics);
      if (mix) setMarketMix(mix);
    } catch (err: any) {
      console.error('Error fetching data:', err);
      setError(`SYSTEM_EXCEPTION: ${err.message || 'Failed to connect to database'}`);
    } finally {
      setLoading(false);
    }
  };

  const seedDatabase = async () => {
    try {
      setLoading(true);
      setError('SEEDING DATABASE...');

      // Seed Ledger
      const { error: lErr } = await supabase.from('ledger').insert([
        { height: '8442109', txns: 142, hash: '0x7f4e...9a12', prev_hash: '0x3b2a...e45f', status: 'verified', terminal: 'Terminal 1', volume: 12400 },
        { height: '8442108', txns: 89, hash: '0xa9c3...23bb', prev_hash: '0x12ff...9c22', status: 'verified', terminal: 'Terminal 2', volume: 8200 },
        { height: '8442107', txns: 215, hash: '0xd441...60ea', prev_hash: '0xbb21...ff01', status: 'verified', terminal: 'Terminal 3', volume: 45000 },
        { height: '8442106', txns: 44, hash: '0xee42...3312', prev_hash: '0x44a1...9100', status: 'verified', terminal: 'Terminal 4', volume: 1250 }
      ]);

      // Seed Analytics
      const { error: aErr } = await supabase.from('analytics').insert([
        { label: '01 OCT', production: 4000, distribution: 2400 },
        { label: '07 OCT', production: 3000, distribution: 1398 },
        { label: '14 OCT', production: 2000, distribution: 9800 },
        { label: '21 OCT', production: 2780, distribution: 3908 },
        { label: '28 OCT', production: 1890, distribution: 4800 },
        { label: '31 OCT', production: 2390, distribution: 3800 }
      ]);

      // Seed Market Mix
      const { error: mErr } = await supabase.from('market_mix').insert([
        { name: 'Diesel Grade A', value: 55, color: '#ffb4a8' },
        { name: 'Unleaded Premium', value: 25, color: '#acc7ff' },
        { name: 'Bio-Fuel E85', value: 20, color: '#353534' }
      ]);

      if (lErr || aErr || mErr) {
        throw new Error(lErr?.message || aErr?.message || mErr?.message || 'Failed to seed some tables');
      }

      await fetchData();
    } catch (err: any) {
      console.error('Seed error:', err);
      setError(`SEED_FAILED: ${err.message}. Ensure tables exist first.`);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();

    // Real-time subscription
    const ledgerSubscription = supabase
      .channel('ledger-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ledger' }, (payload) => {
        fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ledgerSubscription);
    };
  }, []);

  const renderScreen = () => {
    if (loading) return (
      <div className="flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-primary font-headline animate-pulse">INITIALIZING SECURE CONNECTION...</div>
      </div>
    );

    if (error) return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] p-8 text-center">
        <div className="w-16 h-16 bg-error/10 flex items-center justify-center mb-6 border border-error/20">
          <AlertTriangle className="text-error w-8 h-8" />
        </div>
        <h2 className="text-error font-headline font-black text-xl mb-2 uppercase tracking-tight">System Fault Detected</h2>
        <p className="text-slate-400 font-headline text-xs max-w-md leading-relaxed mb-8">{error}</p>
        <div className="flex gap-4">
          <button 
            onClick={() => fetchData()}
            className="px-8 py-3 bg-surface-container-high text-white font-headline font-bold text-xs tracking-widest uppercase hover:bg-surface-bright transition-all"
          >
            RETRY CONNECTION
          </button>
          {error.includes('MIGRATION') && (
            <button 
              onClick={() => seedDatabase()}
              className="px-8 py-3 bg-primary text-on-primary font-headline font-bold text-xs tracking-widest uppercase hover:opacity-90 transition-all"
            >
              SEED INITIAL DATA
            </button>
          )}
        </div>
      </div>
    );

    switch(activeScreen) {
      case 'dashboard': return <Dashboard ledger={ledger} />;
      case 'supply-chain': return <SupplyChain ledger={ledger} />;
      case 'logistics': return <MapScreen ledger={ledger} />;
      case 'blockchain': return <BlockchainExplorer ledger={ledger} />;
      case 'analytics': return <Analytics analyticsData={analyticsData} marketMix={marketMix} />;
      default: return <Dashboard ledger={ledger} />;
    }
  };

  const screenTitles: Record<Screen, string> = {
    dashboard: 'KPI Dashboard',
    'supply-chain': 'Supply Chain',
    blockchain: 'Blockchain Explorer',
    logistics: 'Logistics & Fleet',
    analytics: 'KPI Analytics',
  };

  return (
    <div className="min-h-screen industrial-grid">
      <Sidebar activeScreen={activeScreen} setScreen={setScreen} />
      
      <div className="ml-64 min-h-screen flex flex-col">
        <TopBar title={screenTitles[activeScreen]} />
        
        <main className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeScreen}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </main>

        <footer className="h-8 bg-surface-container-lowest border-t border-white/5 flex items-center px-4 gap-6 overflow-hidden">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="w-1.5 h-1.5 bg-primary animate-ping rounded-full"></span>
            <span className="text-[9px] font-headline font-bold tracking-widest text-primary uppercase">Live Alerts:</span>
          </div>
          <div className="flex-1 overflow-hidden relative">
            <div className="flex gap-12 text-[9px] font-headline text-slate-500 uppercase tracking-tight animate-marquee">
              <span>Block #19,284,102 validated via Node-722</span>
              <span>•</span>
              <span>New Transaction: Refinery 09-TX -&gt; Tanker "Gulf Express"</span>
              <span>•</span>
              <span>Pressure variance detected in Segment 44-B (Delta: 0.2%)</span>
              <span>•</span>
              <span>FuelChain Mainnet load: 42.1 tps</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[9px] font-headline font-bold text-slate-400">
            <span>LAT: 29.7604° N</span>
            <span>LON: 95.3698° W</span>
          </div>
        </footer>
      </div>

      <button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all z-50">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
}
