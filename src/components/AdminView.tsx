import React, { useState } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  Shield,
  Users,
  Package,
  Heart,
  RotateCw,
  Cpu,
  Building2,
  ArrowRight,
  Sparkles,
  Search,
  ExternalLink,
  Server,
  Database,
  Clock,
  ShieldCheck,
  ArrowDown,
  Activity,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AdminViewProps {
  onOpenArchitecture?: () => void;
}

export const AdminView: React.FC<AdminViewProps> = ({ onOpenArchitecture: _onOpenArchitecture }) => {
  const {
    allUsers,
    items,
    wants,
    proposals,
    currentScenario,
    triggerDropNow,
    impersonateUser,
    setActiveTab
  } = useSwapLoop();

  const [activeAdminTab, setActiveAdminTab] = useState<'students' | 'desk' | 'cycles' | 'architecture'>('students');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);
  const [triggerResult, setTriggerResult] = useState<string | null>(null);

  const studentUsers = allUsers.filter(u => u.role === 'Student');
  const deskUsers = allUsers.filter(u => u.role === 'Desk Operator');

  const filteredStudents = studentUsers.filter(u =>
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.contactNote.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRunDrop = async () => {
    setIsTriggering(true);
    setTriggerResult(null);
    try {
      const res = await triggerDropNow();
      setIsTriggering(false);
      setTriggerResult(res.scenarioNote || `Executed drop: ${res.matchedCount} loops formed.`);
      if (res.matchedCount > 0) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err: any) {
      setIsTriggering(false);
      setTriggerResult(err.message || 'Error triggering drop');
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn pb-16">
      {/* 1. ADMIN HEADER & METRICS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white p-6 sm:p-10 rounded-[2.5rem] border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-10 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30 text-xs font-bold uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5 text-pink-400" />
              <span>Full System Oversight • Administrator Console</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Platform Governance & Cycle Diagnostics
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm max-w-2xl font-normal leading-relaxed">
              Real-time administrative telemetry across all student accounts, active item inventories, escrow operations, and graph matching algorithms.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveAdminTab('architecture')}
              className={`px-4 py-2.5 rounded-2xl font-bold text-xs backdrop-blur-md border transition-all flex items-center gap-2 cursor-pointer shadow-sm ${
                activeAdminTab === 'architecture'
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-pink-400'
                  : 'bg-white/10 hover:bg-white/20 text-white border-white/20'
              }`}
            >
              <Cpu className="w-4 h-4 text-pink-400" />
              <span>Interactive Tech Architecture</span>
            </button>

            <button
              onClick={handleRunDrop}
              disabled={isTriggering}
              className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#db2777] to-[#be185d] hover:opacity-95 text-white font-black text-xs transition-all flex items-center gap-2 shadow-lg shadow-pink-500/25 cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isTriggering ? 'animate-spin' : ''}`} />
              <span>{isTriggering ? 'Running Engine...' : '⚡ Run Drop Matching'}</span>
            </button>
          </div>
        </div>

        {triggerResult && (
          <div className="mt-4 p-3 rounded-2xl bg-white/10 border border-white/20 text-xs text-pink-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-pink-400 flex-shrink-0" />
            <span>{triggerResult}</span>
          </div>
        )}

        {/* 4 TELEMETRY CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-8 pt-6 border-t border-slate-800">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Users className="w-3.5 h-3.5 text-blue-400" />
              <span>Registered Students</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{studentUsers.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">100% verified .edu accounts</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Package className="w-3.5 h-3.5 text-pink-400" />
              <span>Active Items</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{items.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">{items.filter(i => i.isFreeGift).length} free community gifts</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Heart className="w-3.5 h-3.5 text-rose-400" />
              <span>Wants Mapped</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{wants.length}</div>
            <div className="text-[10px] text-slate-400 mt-1">Directed cycle edges</div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 mb-1">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Escrow Stations</span>
            </div>
            <div className="text-2xl font-black text-white font-mono">{deskUsers.length} Active</div>
            <div className="text-[10px] text-emerald-400 mt-1">Physical terminal online</div>
          </div>
        </div>
      </div>

      {/* 2. ADMIN SUB-TABS */}
      <div className="flex items-center gap-2 border-b border-pink-100 pb-3">
        <button
          onClick={() => setActiveAdminTab('students')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'students'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-pink-100'
          }`}
        >
          <Users className="w-4 h-4 text-pink-500" />
          <span>Student Profiles & Inventories ({studentUsers.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('desk')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'desk'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-pink-100'
          }`}
        >
          <Building2 className="w-4 h-4 text-emerald-500" />
          <span>Desk Operator Credentials & Escrow</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('cycles')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'cycles'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-pink-100'
          }`}
        >
          <RotateCw className="w-4 h-4 text-purple-500" />
          <span>Cycle Diagnostics ({proposals.length})</span>
        </button>

        <button
          onClick={() => setActiveAdminTab('architecture')}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeAdminTab === 'architecture'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:text-slate-900 border border-pink-100'
          }`}
        >
          <Cpu className="w-4 h-4 text-pink-500" />
          <span>Interactive Tech Architecture (Section 32)</span>
        </button>
      </div>

      {/* 3. SUB-TAB CONTENT 1: STUDENTS & INVENTORIES */}
      {activeAdminTab === 'students' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search students by name, email, or hostel room..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-2xl border border-pink-100 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-pink-400"
              />
            </div>
            <div className="text-xs text-slate-500 font-semibold">
              Click "Test As Student" to instantly impersonate and verify reciprocal matching.
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {filteredStudents.map((st) => {
              const studentItems = items.filter(i => i.ownerId === st.id);
              const studentWants = wants.filter(w => w.studentId === st.id);
              const wantedItems = studentWants.map(w => items.find(i => i.id === w.itemId)).filter(Boolean);

              return (
                <div
                  key={st.id}
                  className="bg-white p-5 rounded-3xl border border-pink-100 shadow-sm hover:border-pink-300 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-pink-50 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-black text-sm flex items-center justify-center">
                        {st.name[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-sm text-slate-900">{st.name}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            st.trustLevel === 'New'
                              ? 'bg-pink-50 border-pink-200 text-pink-700'
                              : st.trustLevel === 'Trusted'
                              ? 'bg-purple-50 border-purple-200 text-purple-700'
                              : 'bg-amber-50 border-amber-200 text-amber-800'
                          }`}>
                            {st.trustLevel} Tier
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-slate-900 text-white text-[10px] font-bold">
                            {st.swapScore} pts
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {st.email} • <span className="text-pink-600 font-medium">{st.contactNote}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        impersonateUser(st.id);
                        setActiveTab('dashboard');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-pink-50 hover:bg-[#db2777] hover:text-white text-[#db2777] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shadow-2xs"
                    >
                      <span>Test As {st.name.split(' ')[0]}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Inventories Grid: Have List vs Want List */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    {/* Have List */}
                    <div className="p-3.5 rounded-2xl bg-[#FFF7FA] border border-pink-100/80 space-y-2">
                      <div className="font-extrabold text-pink-700 flex items-center justify-between text-[11px] uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Package className="w-3.5 h-3.5" />
                          <span>Have Inventory ({studentItems.length})</span>
                        </span>
                      </div>
                      {studentItems.length === 0 ? (
                        <div className="text-slate-400 italic text-[11px]">No items listed</div>
                      ) : (
                        <div className="space-y-1.5">
                          {studentItems.map(it => (
                            <div key={it.id} className="p-2 rounded-xl bg-white border border-pink-100 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-800">{it.title}</span>
                                <span className="text-slate-400 ml-1.5 text-[10px]">• {it.category}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]">
                                {it.valueBand}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Want List */}
                    <div className="p-3.5 rounded-2xl bg-rose-50/40 border border-rose-100/80 space-y-2">
                      <div className="font-extrabold text-rose-700 flex items-center justify-between text-[11px] uppercase tracking-wider">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5" />
                          <span>Want Queue ({wantedItems.length})</span>
                        </span>
                      </div>
                      {wantedItems.length === 0 ? (
                        <div className="text-slate-400 italic text-[11px]">No wants queued</div>
                      ) : (
                        <div className="space-y-1.5">
                          {wantedItems.map(it => it && (
                            <div key={it.id} className="p-2 rounded-xl bg-white border border-rose-100 flex items-center justify-between">
                              <div>
                                <span className="font-bold text-slate-800">{it.title}</span>
                                <span className="text-slate-400 ml-1.5 text-[10px]">• {it.category}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded-md bg-pink-50 text-pink-700 font-bold text-[10px]">
                                Wanted
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 3. SUB-TAB CONTENT 2: DESK OPERATOR OVERSIGHT */}
      {activeAdminTab === 'desk' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-50 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-600" />
                <span>Certified Escrow Operator Credentials</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Authorized staff and student coordinators permitted to authenticate physical item drop-offs.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('desk')}
              className="px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <span>Launch Escrow Terminal Console</span>
              <ExternalLink className="w-3.5 h-3.5 text-pink-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deskUsers.map(op => (
              <div key={op.id} className="p-5 rounded-2xl bg-emerald-50/50 border border-emerald-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center">
                      OP
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-slate-900">{op.name}</div>
                      <div className="text-xs text-slate-500">{op.email}</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-black uppercase">
                    Active Station
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-white border border-emerald-100 text-xs text-slate-700 space-y-1">
                  <div><strong>Station:</strong> {op.contactNote}</div>
                  <div><strong>Terminal Key:</strong> ESCROW-AUTH-0982-CAMPUS</div>
                  <div><strong>Total Verifications:</strong> {op.completedSwapsCount} authenticated</div>
                </div>

                <button
                  onClick={() => {
                    impersonateUser(op.id);
                    setActiveTab('desk');
                  }}
                  className="w-full py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Log in as this Desk Operator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SUB-TAB CONTENT 3: CYCLE DIAGNOSTICS */}
      {activeAdminTab === 'cycles' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-pink-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-pink-50 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                <RotateCw className="w-5 h-5 text-purple-600" />
                <span>Circular Proposal Engine Diagnostics</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Active multi-student cycles computed by the directed-graph matching algorithm.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-purple-50 text-purple-700 font-bold text-xs border border-purple-200">
              Active Scenario: {currentScenario}
            </span>
          </div>

          {proposals.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500 space-y-3">
              <RotateCw className="w-8 h-8 text-slate-400 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
              <div>No circular proposals active right now.</div>
              <button
                onClick={handleRunDrop}
                className="px-4 py-2 rounded-xl bg-[#db2777] text-white font-bold text-xs cursor-pointer"
              >
                Run Matching Engine Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {proposals.map(p => (
                <div key={p.id} className="p-5 rounded-2xl border border-pink-200 bg-[#FFFDFE] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-900">
                      CYCLE #{p.id.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : p.status === 'sealed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {p.status} ({p.members.length}-student loop)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {p.members.map(m => {
                      const realUser = allUsers.find(u => u.id === m.studentId);
                      const itemGiven = items.find(i => i.id === m.givesItemId);
                      const itemRecv = items.find(i => i.id === m.receivesItemId);

                      return (
                        <div key={m.studentId} className="p-3 rounded-xl bg-white border border-pink-100 text-xs space-y-1">
                          <div className="font-bold text-slate-900">{m.name || realUser?.name} ({m.codename})</div>
                          <div className="text-[11px] text-pink-600">Gives: {itemGiven?.title || 'Item'}</div>
                          <div className="text-[11px] text-emerald-600">Receives: {itemRecv?.title || 'Item'}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            Dropoff: {m.dropoffCode} • {m.dropoffDone ? '✅ Deposited' : '⏳ Pending'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SUB-TAB CONTENT 4: INTERACTIVE TECH ARCHITECTURE */}
      {activeAdminTab === 'architecture' && (
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-pink-100 shadow-sm space-y-8 animate-fadeIn">
          <div>
            <div className="text-xs uppercase font-extrabold tracking-widest text-[#db2777] flex items-center gap-1.5 mb-1">
              <Cpu className="w-4 h-4" />
              <span>System & Tech Architecture (Section 32)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              How SwapLoop Works Under the Hood
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-3xl leading-relaxed">
              SwapLoop replaces prices and bargaining with a directed-graph matching engine that computes closed circular cycles and multi-party gift chains across campus dorms.
            </p>
          </div>

          {/* Interactive Architecture Flow Diagram */}
          <div className="space-y-6">
            {/* Layer 1: Client */}
            <div className="p-5 sm:p-6 rounded-2xl bg-[#fff7f9] border border-pink-200 relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 font-bold text-slate-900 text-sm">
                  <div className="w-9 h-9 rounded-xl bg-white text-[#db2777] flex items-center justify-center shadow-sm">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span>1. Frontend Client Layer (React 18 + Vite + Tailwind CSS)</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-pink-600 bg-white px-3 py-1 rounded-full border border-pink-100">
                  Port 5173
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-12">
                Blush mist design system (`#FFF7F9`), reactive auth state, strict blind proposals UI masking, live countdowns, micro-interactions, and role switching (`[Student]`, `[Desk Operator]`, `[Admin]`).
              </p>
            </div>

            {/* Flow Connector Arrow */}
            <div className="flex justify-center -my-3">
              <div className="w-8 h-8 rounded-full bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 animate-bounce">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* Layer 2: API Gateway */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3 font-bold text-slate-900 text-sm">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
                    <Server className="w-5 h-5" />
                  </div>
                  <span>2. REST API & Authorization Layer (Node.js + Express)</span>
                </div>
                <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                  Port 3001
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pl-12 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-1 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-pink-500" /> Blind Proposal Sanitizer
                  </strong>
                  <span>Strips real names and contact notes from network payload until proposal is sealed (F7).</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-1 flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Trust Rule Validator
                  </strong>
                  <span>Enforces T4 value bands: New (Low), Trusted (Low+Med), Veteran (All).</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                  <strong className="text-slate-900 block mb-1 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-purple-600" /> Daily Drop Cron
                  </strong>
                  <span>Scheduled background job executes matching daily at 5:00 PM.</span>
                </div>
              </div>
            </div>

            {/* Flow Connector Arrow */}
            <div className="flex justify-center -my-3">
              <div className="w-8 h-8 rounded-full bg-white border border-pink-200 shadow-sm flex items-center justify-center text-pink-500 animate-bounce">
                <ArrowDown className="w-4 h-4" />
              </div>
            </div>

            {/* Layer 3: Engine, Escrow & Database */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                  <Cpu className="w-4 h-4 text-pink-600" />
                  <span>3A. Swap Engine Pipeline</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 pl-5 list-disc">
                  <li><strong>Cycle Finder:</strong> DFS search for closed loops ($k = 3\dots 5$).</li>
                  <li><strong>Gift Chain Finder:</strong> Traces pay-it-forward free gift cascades.</li>
                  <li><strong>Trust T4 Filter:</strong> Disqualifies loops with value violations.</li>
                  <li><strong>Optimizer:</strong> Max-independent set maximizes students satisfied.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>3B. Physical Escrow Terminal</span>
                </div>
                <ul className="text-xs text-slate-700 space-y-1.5 pl-5 list-disc">
                  <li><strong>Drop-off Auth:</strong> Single-use 6-digit verification codes.</li>
                  <li><strong>Time Window:</strong> Evening window locked outside 5:00–5:30 PM.</li>
                  <li><strong>Locked Pickup:</strong> Pickup codes released only when all items are at desk.</li>
                  <li><strong>Anti-Ghosting:</strong> 24h deadline automatic item return codes.</li>
                </ul>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-2">
                  <Database className="w-4 h-4 text-indigo-600" />
                  <span>3C. Persistent Storage (SQLite)</span>
                </div>
                <div className="text-xs text-slate-600 space-y-1.5 pl-2">
                  <div>Path: <code className="text-pink-600 font-mono font-bold text-[11px]">server/data/swaploop.db</code></div>
                  <div className="text-[11px] text-slate-500 leading-relaxed">
                    Stores users, items, wants, proposals, single-use codes, declined signatures, reports, and scenario states with full persistence across server restarts.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminView;
