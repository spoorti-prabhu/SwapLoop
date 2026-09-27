import React, { useState, useEffect } from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import {
  RotateCw,
  Clock,
  Zap,
  EyeOff,
  Eye,
  CheckCircle2,
  KeyRound,
  QrCode,
  UserCheck,
  Building2,
  Users,
  Repeat
} from 'lucide-react';
import { SwapMeetModal } from './SwapMeetModal';
import { ReportModal } from './ReportModal';

export const TheDropView: React.FC = () => {
  const {
    currentUser,
    proposals,
    dropCountdownSeconds,
    triggerDropNow,
    acceptProposal,
    declineProposal,
    expireProposal,
    items,
    allUsers,
    impersonateUser
  } = useSwapLoop();

  const [lastMatchResult, setLastMatchResult] = useState<string | null>(null);
  const [timeRemainingMap, setTimeRemainingMap] = useState<Record<string, number>>({});
  const [selectedHandoverMap, setSelectedHandoverMap] = useState<Record<string, 'desk' | 'meet'>>({});
  
  // Modals
  const [meetModalProposal, setMeetModalProposal] = useState<any | null>(null);
  const [reportData, setReportData] = useState<{ userId: string; userName: string; proposalId: string } | null>(null);

  if (!currentUser) return null;

  // Format seconds to HH:MM:SS
  const formatTime = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Timer loop for active proposal expiry countdowns (F9)
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const updatedMap: Record<string, number> = {};

      proposals.forEach(p => {
        if (p.status === 'proposed') {
          const remainingSec = Math.max(0, Math.floor((p.expiresAt - now) / 1000));
          updatedMap[p.id] = remainingSec;

          if (remainingSec === 0) {
            expireProposal(p.id);
          }
        }
      });

      setTimeRemainingMap(updatedMap);
    }, 1000);

    return () => clearInterval(interval);
  }, [proposals, currentUser.id, expireProposal]);

  const handleTriggerDrop = async () => {
    const res = await triggerDropNow();
    if (res.scenarioNote) {
      setLastMatchResult(res.scenarioNote);
    }
  };

  const getItemTitle = (itemId: string): string => {
    const item = items.find(i => i.id === itemId);
    return item ? item.title : 'Item';
  };

  const getStudent = (studentId: string) => {
    return allUsers.find(u => u.id === studentId);
  };

  const handleAccept = (proposalId: string) => {
    const choice = selectedHandoverMap[proposalId] || 'desk';
    acceptProposal(proposalId, currentUser.id, choice);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* The Drop Countdown Hero Component (F5) */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#fff7f9] via-white to-[#FAF3F8] border border-pink-200 p-6 sm:p-10 shadow-sm">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-xs font-bold uppercase tracking-wider text-pink-600">
            <RotateCw className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
            <span>F5 & F6 • Daily Algorithmic Matching</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            The Daily Drop Engine
          </h1>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            Every day at 8:00 PM, SwapLoop’s directed cycle engine analyzes all student Have & Want lists, enforcing trust levels and finding multi-student swap loops that maximize student happiness.
          </p>

          {/* Countdown & Trigger Button */}
          <div className="pt-3 flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white border border-pink-200 shadow-sm">
              <Clock className="w-5 h-5 text-pink-500" />
              <div>
                <div className="text-[10px] uppercase font-bold text-slate-400">Next Scheduled Drop</div>
                <div className="text-xl sm:text-2xl font-black text-slate-900 font-mono tracking-tight">
                  {formatTime(dropCountdownSeconds)}
                </div>
              </div>
            </div>

            <button
              onClick={handleTriggerDrop}
              className="inline-flex items-center gap-2.5 px-6 py-4 rounded-2xl bg-gradient-to-r from-[#f472b6] to-[#fb7185] hover:opacity-95 text-white font-bold text-sm shadow-md transition-all active:scale-95"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>Admin: Trigger Drop Now</span>
            </button>
          </div>

          {/* Scenario Simulation Note */}
          {lastMatchResult && (
            <div className="p-3.5 rounded-2xl bg-pink-50 border border-pink-200 text-xs text-pink-900 flex items-start gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-pink-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Drop Engine Result: </span>
                {lastMatchResult}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Active Proposals Section (F7, F8, F9) */}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>Drop Proposals & Blind Loops</span>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">
                {proposals.length}
              </span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Strict Blind Rule (F7): Real names and private contact notes remain completely withheld until 100% of participants accept.
            </p>
          </div>
        </div>

        {proposals.length === 0 ? (
          <div className="bg-white rounded-3xl border border-pink-100 p-12 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#fff7f9] flex items-center justify-center text-pink-400">
              <RotateCw className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">No active Drop proposals</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click <strong className="text-pink-600">"Admin: Trigger Drop Now"</strong> above to run the matching engine on the current student lists!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {proposals.map((proposal) => {
              const isSealed = proposal.status === 'sealed';
              const isProposed = proposal.status === 'proposed';
              const isDeclined = proposal.status === 'declined';
              const isExpired = proposal.status === 'expired';
              const isCompleted = proposal.status === 'completed';
              const isFailed = proposal.status === 'failed';

              const remainingSec = timeRemainingMap[proposal.id] ?? 300;
              const isUserMember = proposal.members.some(m => m.studentId === currentUser.id);
              const userChoice = selectedHandoverMap[proposal.id] || 'desk';

              return (
                <div
                  key={proposal.id}
                  className={`bg-white rounded-3xl border p-6 sm:p-8 shadow-sm transition-all ${
                    isSealed
                      ? 'border-emerald-200 ring-2 ring-emerald-50'
                      : isDeclined || isExpired || isFailed
                      ? 'border-slate-200 opacity-75 bg-slate-50/50'
                      : 'border-pink-200 ring-2 ring-pink-50'
                  }`}
                >
                  {/* Proposal Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-pink-50">
                    <div className="flex items-center gap-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                          isSealed
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isProposed
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : isCompleted
                            ? 'bg-purple-50 text-purple-700 border border-purple-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {proposal.status === 'proposed' && '⏳ Blind Proposal Pending'}
                        {proposal.status === 'sealed' && '🔒 Loop Sealed & Authenticated'}
                        {proposal.status === 'declined' && '❌ Dissolved (Declined)'}
                        {proposal.status === 'expired' && '⏰ Expired (Timer Elapsed)'}
                        {proposal.status === 'completed' && '🎉 Fully Completed at Desk'}
                        {proposal.status === 'failed' && '⚠️ Failed (Deadline Expiry)'}
                      </span>

                      <span className="text-xs text-slate-400">
                        {proposal.members.length}-Student Closed Cycle Loop
                      </span>
                    </div>

                    {/* Expiry Timer (F9) */}
                    {isProposed && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold font-mono">
                        <Clock className="w-3.5 h-3.5 animate-pulse" />
                        <span>Acceptance Timer: {formatTime(remainingSec)}</span>
                      </div>
                    )}
                  </div>

                  {/* Visual Animated Loop Diagram (Section 12 & 31) */}
                  <div className="mt-4 p-4 rounded-2xl bg-[#fff7f9] border border-pink-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-pink-600 mb-2 flex items-center gap-1.5">
                      <Repeat className="w-3.5 h-3.5" />
                      <span>Circular Loop Flow (Student A &rarr; Student B &rarr; Student C &rarr; Student A)</span>
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold py-2">
                      {proposal.members.map((m) => (
                        <React.Fragment key={m.studentId}>
                          <div className="px-3 py-1.5 rounded-full bg-white border border-pink-200 text-slate-800 shadow-sm flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse"></span>
                            <span>{isSealed ? getStudent(m.studentId)?.name.split(' ')[0] : m.codename}</span>
                            <span className="text-[10px] text-slate-400 font-normal">({getItemTitle(m.givesItemId)})</span>
                          </div>
                          <span className="text-pink-500 font-bold text-sm">
                            &rarr;
                          </span>
                        </React.Fragment>
                      ))}
                      <div className="px-2.5 py-1 rounded-full bg-pink-100 text-pink-700 text-[11px] font-bold">
                        Cycle Complete
                      </div>
                    </div>
                  </div>

                  {/* Loop Nodes View */}
                  <div className="py-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-4">
                      {isSealed ? 'Sealed Swappers & Direct Deliveries' : 'Blind Swappers (Codenames Enforced):'}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {proposal.members.map((member, idx) => {
                        const student = getStudent(member.studentId);
                        const givesTitle = getItemTitle(member.givesItemId);
                        const receivesTitle = getItemTitle(member.receivesItemId);
                        const isThisMe = member.studentId === currentUser.id;

                        return (
                          <div
                            key={member.studentId}
                            className={`p-5 rounded-2xl border transition-all ${
                              isThisMe
                                ? 'bg-[#fff7f9] border-pink-300 ring-2 ring-pink-100'
                                : 'bg-slate-50/60 border-slate-200'
                            }`}
                          >
                            {/* Member Identity Header */}
                            <div className="flex items-center justify-between gap-2 mb-3">
                              <div className="flex items-center gap-2">
                                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center">
                                  {idx + 1}
                                </span>
                                <div>
                                  <div className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                    {isSealed ? (
                                      <>
                                        <Eye className="w-3 h-3 text-emerald-600" />
                                        <span>{student?.name || member.name}</span>
                                      </>
                                    ) : (
                                      <>
                                        <EyeOff className="w-3 h-3 text-slate-400" />
                                        <span>{member.codename}</span>
                                      </>
                                    )}
                                    {isThisMe && (
                                      <span className="text-[10px] text-pink-600 font-bold px-1.5 py-0.2 rounded-full bg-pink-100">
                                        YOU
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-[10px] text-slate-500">
                                    {isSealed ? (student?.email || member.email) : 'Identity Hidden'}
                                  </div>
                                </div>
                              </div>

                              {/* Acceptance State */}
                              <div>
                                {member.accepted ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    <span>Accepted</span>
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600">
                                    <span>Awaiting</span>
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Give & Receive Cards (F7) */}
                            <div className="space-y-2 text-xs">
                              <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                                <span className="text-[10px] uppercase font-bold text-pink-500 block">
                                  You Give:
                                </span>
                                <span className="font-bold text-slate-900">{givesTitle}</span>
                              </div>

                              <div className="p-2.5 rounded-xl bg-white border border-pink-100">
                                <span className="text-[10px] uppercase font-bold text-emerald-600 block">
                                  You Receive:
                                </span>
                                <span className="font-bold text-slate-900">{receivesTitle}</span>
                              </div>
                            </div>

                            {/* SEALED INFO: Real contact notes & dropoff/pickup codes (F8, T2) */}
                            {isSealed && (
                              <div className="mt-3 pt-3 border-t border-pink-100/80 space-y-2">
                                <div className="text-[11px] text-slate-600">
                                  <strong>Contact:</strong> {student?.contactNote || member.contactNote}
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-[9px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                                      <KeyRound className="w-2.5 h-2.5 text-pink-500" /> Dropoff Code
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {member.dropoffCode}
                                    </span>
                                    <div className="text-[9px] text-slate-400 mt-0.5">
                                      {member.dropoffDone ? '✓ Checked in' : 'Pending drop'}
                                    </div>
                                  </div>

                                  <div className="p-2 rounded-xl bg-white border border-slate-200">
                                    <span className="text-[9px] uppercase font-bold text-slate-400 block flex items-center gap-1">
                                      <QrCode className="w-2.5 h-2.5 text-emerald-600" /> Pickup Code
                                    </span>
                                    <span className="font-mono font-bold text-slate-900">
                                      {member.pickupCode}
                                    </span>
                                    <div className="text-[9px] text-slate-400 mt-0.5">
                                      {member.pickupDone ? '✓ Collected' : 'Pending pickup'}
                                    </div>
                                  </div>
                                </div>

                                {member.returnCode && (
                                  <div className="p-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-[11px]">
                                    <strong>Return Code:</strong> <span className="font-mono font-bold">{member.returnCode}</span>
                                    <div className="text-[9px] text-rose-600">Present to desk to retrieve your item.</div>
                                  </div>
                                )}

                                {/* Report Member Button (Section 22) */}
                                {!isThisMe && (
                                  <div className="pt-1 text-right">
                                    <button
                                      onClick={() => setReportData({
                                        userId: member.studentId,
                                        userName: student?.name || member.name || 'Member',
                                        proposalId: proposal.id
                                      })}
                                      className="text-[10px] text-rose-500 hover:text-rose-700 underline font-medium"
                                    >
                                      Report Member
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                            {/* Quick Impersonate Switcher so tester can accept as this student */}
                            {!isThisMe && isProposed && !member.accepted && (
                              <div className="mt-3 pt-2 border-t border-slate-200/60">
                                <button
                                  onClick={() => impersonateUser(member.studentId)}
                                  className="w-full text-center text-[10px] text-pink-600 hover:text-pink-700 font-semibold flex items-center justify-center gap-1"
                                >
                                  <UserCheck className="w-3 h-3" />
                                  <span>Switch to {student?.name.split(' ')[0]} to Accept/Decline</span>
                                </button>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions for Current User (F8, F9, Section 17 Handover Choice) */}
                  {isProposed && isUserMember && (
                    <div className="pt-4 border-t border-pink-50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Handover Choice Radio */}
                      <div className="flex items-center gap-3 text-xs">
                        <span className="font-bold text-slate-700">Handover Preference:</span>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`handover-${proposal.id}`}
                            value="desk"
                            checked={userChoice === 'desk'}
                            onChange={() => setSelectedHandoverMap({ ...selectedHandoverMap, [proposal.id]: 'desk' })}
                            className="text-pink-600 focus:ring-pink-400"
                          />
                          <span className="flex items-center gap-1">
                            <Building2 className="w-3.5 h-3.5 text-pink-500" />
                            Swap Desk Escrow
                          </span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name={`handover-${proposal.id}`}
                            value="meet"
                            checked={userChoice === 'meet'}
                            onChange={() => setSelectedHandoverMap({ ...selectedHandoverMap, [proposal.id]: 'meet' })}
                            className="text-pink-600 focus:ring-pink-400"
                          />
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-purple-500" />
                            Campus Quad Meet
                          </span>
                        </label>
                      </div>

                      {/* Accept / Decline Buttons */}
                      {!proposal.members.find(m => m.studentId === currentUser.id)?.accepted ? (
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => declineProposal(proposal.id, currentUser.id)}
                            className="px-5 py-2.5 rounded-full border border-rose-200 text-rose-600 hover:bg-rose-50 font-semibold text-xs transition-colors"
                          >
                            Decline Proposal (F8)
                          </button>
                          <button
                            onClick={() => handleAccept(proposal.id)}
                            className="px-6 py-2.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-sm transition-all"
                          >
                            Accept Proposal (F8)
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          You have accepted this proposal. Waiting for other swappers...
                        </span>
                      )}
                    </div>
                  )}

                  {/* When sealed, Swap Meet Modal Trigger or Desk Helper */}
                  {isSealed && (
                    <div className="pt-4 border-t border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-emerald-800">
                      <span>
                        🔒 <strong>All students accepted!</strong> Handover Method: <strong className="uppercase">{proposal.handoverMethod || 'desk'}</strong>
                      </span>

                      {proposal.handoverMethod === 'meet' && (
                        <button
                          onClick={() => setMeetModalProposal(proposal)}
                          className="px-4 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-sm transition-all flex items-center gap-1.5"
                        >
                          <Users className="w-3.5 h-3.5" />
                          <span>Open Campus Quad Swap Meet Check-in</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Swap Meet Modal */}
      {meetModalProposal && (
        <SwapMeetModal
          isOpen={!!meetModalProposal}
          onClose={() => setMeetModalProposal(null)}
          proposal={meetModalProposal}
          currentUserId={currentUser.id}
        />
      )}

      {/* Report Modal */}
      {reportData && (
        <ReportModal
          isOpen={!!reportData}
          onClose={() => setReportData(null)}
          reportedUserId={reportData.userId}
          reportedUserName={reportData.userName}
          proposalId={reportData.proposalId}
        />
      )}
    </div>
  );
};

export default TheDropView;
