import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { ScrollText, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  fetchAuditLogs,
  selectAuditLogs,
  selectAuditLogsPage,
  selectAuditLogsTotal,
  selectAuditLogsTotalPages,
  selectPlatformLoading,
} from '../../store/slices/platformSlice';

export default function AuditLog() {
  const { i18n } = useTranslation();
  const dispatch = useDispatch();
  const isRtl = i18n.language.startsWith('ar');

  const logs = useSelector(selectAuditLogs);
  const total = useSelector(selectAuditLogsTotal);
  const page = useSelector(selectAuditLogsPage);
  const totalPages = useSelector(selectAuditLogsTotalPages);
  const loading = useSelector(selectPlatformLoading);

  const [pendingPage, setPendingPage] = useState(1);

  useEffect(() => {
    dispatch(fetchAuditLogs({ page: pendingPage }));
  }, [dispatch, pendingPage]);

  const formatAction = (action) => action.replace(/_/g, ' ');

  const goToPage = (p) => {
    if (p < 1 || p > totalPages || p === page) return;
    setPendingPage(p);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 max-w-4xl mx-auto pb-10">
      <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ScrollText className="w-6 h-6 text-primary-600" /> {isRtl ? 'سجل التدقيق' : 'Audit Log'}
        </h2>
        <p className="text-sm font-medium text-slate-500 mt-1">
          {isRtl ? 'كل إجراء اتخذه مسؤولو المنصة' : 'Every action taken by a platform admin'}
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
        {loading && logs.length === 0 ? (
          <div className="py-16 flex justify-center"><Loader2 className="w-8 h-8 text-primary-600 animate-spin" /></div>
        ) : logs.length > 0 ? (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-wider">
                    <th className="p-3 text-start">{isRtl ? 'الإجراء' : 'Action'}</th>
                    <th className="p-3 text-start">{isRtl ? 'الكيان' : 'Entity'}</th>
                    <th className="p-3 text-start">{isRtl ? 'بواسطة' : 'By'}</th>
                    <th className="p-3 text-start">{isRtl ? 'التاريخ' : 'When'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {logs.map((log) => (
                    <tr key={log.id}>
                      <td className="p-3 font-bold text-slate-800 capitalize">{formatAction(log.action)}</td>
                      <td className="p-3 text-slate-500 font-mono text-xs">{log.entity_type} #{log.entity_id}</td>
                      <td className="p-3 text-slate-600">{log.admin_email || '—'}</td>
                      <td className="p-3 text-slate-400 text-xs">{new Date(log.created_at).toLocaleString(isRtl ? 'ar-EG' : 'en-US')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between pt-6 mt-6 border-t border-slate-100">
              <p className="text-xs font-bold text-slate-400">
                {isRtl
                  ? `عرض صفحة ${page} من ${totalPages} (${total} إجمالاً)`
                  : `Page ${page} of ${totalPages} (${total} total)`}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={page <= 1 || loading}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={isRtl ? 'الصفحة السابقة' : 'Previous page'}
                >
                  <ChevronLeft className="w-4 h-4 rtl:rotate-180" />
                </button>
                <span className="text-sm font-bold text-slate-700 min-w-[2rem] text-center">{page}</span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={page >= totalPages || loading}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  aria-label={isRtl ? 'الصفحة التالية' : 'Next page'}
                >
                  <ChevronRight className="w-4 h-4 rtl:rotate-180" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <ScrollText className="w-12 h-12 text-slate-350 mb-2" />
            <p className="text-sm font-bold text-slate-400">{isRtl ? 'لا يوجد نشاط بعد' : 'No activity yet'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
