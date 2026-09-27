import React from 'react';
import { useSwapLoop } from '../context/SwapLoopContext';
import { X, Bell, Trash2, RotateCw, Lock, Building2, Info } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, clearNotifications } = useSwapLoop();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-pink-100 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-pink-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-pink-50 text-pink-500 flex items-center justify-center">
                <Bell className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-900 text-base">In-App Notifications (F13)</h3>
            </div>

            <div className="flex items-center gap-2">
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                  title="Clear all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-[#fff7f9] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {notifications.length === 0 ? (
              <div className="text-center py-16 text-xs text-slate-400">
                No notifications right now.
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    onClick={() => markNotificationRead(notif.id)}
                    className={`p-4 rounded-2xl border text-xs cursor-pointer transition-all ${
                      notif.read
                        ? 'bg-white border-slate-100 text-slate-600'
                        : 'bg-[#fff7f9] border-pink-200 text-slate-900 font-medium shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-1.5 font-bold text-pink-600">
                        {notif.type === 'proposal' && <RotateCw className="w-3.5 h-3.5" />}
                        {notif.type === 'sealed' && <Lock className="w-3.5 h-3.5 text-emerald-600" />}
                        {notif.type === 'desk' && <Building2 className="w-3.5 h-3.5 text-purple-600" />}
                        {notif.type === 'system' && <Info className="w-3.5 h-3.5 text-blue-500" />}
                        <span>{notif.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">
                        {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-slate-600 leading-relaxed text-[11px] mt-1">
                      {notif.message}
                    </p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationDrawer;
