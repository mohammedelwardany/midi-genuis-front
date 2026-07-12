import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertTriangle, HelpCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import ModalPortal from '../components/ModalPortal';

const ConfirmDialogContext = createContext(null);

// App-wide replacement for window.confirm() - a real in-app modal instead of
// the browser's native dialog (which can't be styled, doesn't respect RTL,
// and looks jarring next to the rest of the UI). Usage mirrors
// window.confirm()'s ergonomics on purpose: `if (await confirm('message'))`
// or `if (await confirm({ message, title, danger }))`.
export function ConfirmDialogProvider({ children }) {
  const { t } = useTranslation();
  const [request, setRequest] = useState(null);
  const resolveRef = useRef(null);

  const confirm = useCallback((options) => {
    return new Promise((resolve) => {
      resolveRef.current = resolve;
      setRequest(typeof options === 'string' ? { message: options } : options);
    });
  }, []);

  const settle = useCallback((result) => {
    setRequest(null);
    if (resolveRef.current) {
      resolveRef.current(result);
      resolveRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!request) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') settle(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [request, settle]);

  return (
    <ConfirmDialogContext.Provider value={confirm}>
      {children}
      {request && (
        <ModalPortal>
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4 animate-in fade-in duration-200"
            onClick={() => settle(false)}
          >
            <div
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
              role="alertdialog"
              aria-modal="true"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${request.danger ? 'bg-rose-100 text-rose-600' : 'bg-primary-100 text-primary-600'}`}>
                {request.danger ? <AlertTriangle className="w-6 h-6" /> : <HelpCircle className="w-6 h-6" />}
              </div>
              {request.title && <h3 className="text-lg font-extrabold text-slate-900 mb-2">{request.title}</h3>}
              <p className="text-sm font-medium text-slate-600 mb-6 leading-relaxed">{request.message}</p>
              <div className="flex gap-3">
                <button
                  onClick={() => settle(false)}
                  className="flex-1 px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors"
                >
                  {request.cancelText || t('common.cancel', { defaultValue: 'Cancel' })}
                </button>
                <button
                  onClick={() => settle(true)}
                  className={`flex-1 px-5 py-3 font-bold rounded-xl text-sm transition-colors text-white ${request.danger ? 'bg-rose-600 hover:bg-rose-700' : 'bg-primary-600 hover:bg-primary-700'}`}
                >
                  {request.confirmText || t('common.confirm', { defaultValue: 'Confirm' })}
                </button>
              </div>
            </div>
          </div>
        </ModalPortal>
      )}
    </ConfirmDialogContext.Provider>
  );
}

/** Returns confirm(messageOrOptions) => Promise<boolean> - resolves true on Confirm, false on Cancel/backdrop/Escape. */
export function useConfirm() {
  const ctx = useContext(ConfirmDialogContext);
  if (!ctx) {
    throw new Error('useConfirm must be used within a ConfirmDialogProvider');
  }
  return ctx;
}
