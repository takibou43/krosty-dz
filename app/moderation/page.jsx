'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import PageHeader from '@/components/PageHeader';
import Icon from '@/components/Icon';
import { useAuth } from '@/utils/useAuth';
import { getOpenReports, resolveReport, deleteCar } from '@/utils/supabase';

const REASON_LABELS = {
  fraud: 'احتيال أو نصب',
  sold: 'السيارة مباعة',
  wrong_info: 'معلومات خاطئة',
  duplicate: 'إعلان مكرر',
  offensive: 'محتوى مسيء',
  other: 'سبب آخر',
};

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 60) return `منذ ${mins} دقيقة`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `منذ ${hours} ساعة`;
  return `منذ ${Math.floor(hours / 24)} يوم`;
}

export default function ModerationPage() {
  const { user, loading: authLoading } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  // الصلاحية الحقيقية تفرضها سياسات RLS في قاعدة البيانات؛
  // فشل الجلب يعني ببساطة أن هذا المستخدم ليس مشرفاً.
  const [denied, setDenied] = useState(false);

  const load = async () => {
    setLoading(true);
    const data = await getOpenReports();
    if (data === null) {
      setDenied(true);
      setReports([]);
    } else {
      setDenied(false);
      setReports(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!authLoading && user) load();
    else if (!authLoading) setLoading(false);
  }, [authLoading, user]);

  const handleIgnore = async (reportId) => {
    setBusyId(reportId);
    const ok = await resolveReport(reportId);
    if (ok) setReports((prev) => prev.filter((r) => r.id !== reportId));
    setBusyId(null);
  };

  const handleDeleteCar = async (report) => {
    setBusyId(report.id);
    const ok = await deleteCar(report.car_id);
    if (ok) {
      await resolveReport(report.id);
      setReports((prev) => prev.filter((r) => r.car_id !== report.car_id));
    }
    setBusyId(null);
  };

  return (
    <div className="flex min-h-screen flex-col bg-canvas" dir="rtl">
      <Header />

      <PageHeader
        icon="shield"
        title="الإشراف"
        subtitle="البلاغات الواردة على الإعلانات"
      />

      <main className="mx-auto w-full max-w-4xl flex-1 px-4 py-6">
        {(authLoading || loading) && (
          <div className="rounded-card border border-line bg-white px-6 py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-line border-t-accent" />
          </div>
        )}

        {!authLoading && !loading && (!user || denied) && (
          <div className="rounded-card border border-dashed border-line bg-white px-6 py-20 text-center">
            <Icon name="lock" className="mx-auto h-10 w-10 text-slate-300" strokeWidth={1.4} />
            <p className="mt-3 text-sm font-semibold text-ink">هذه الصفحة للمشرف فقط</p>
            <p className="mt-1 text-xs text-muted">
              {user ? 'حسابك لا يملك صلاحية الإشراف.' : 'سجّل الدخول بحساب المشرف.'}
            </p>
            <Link
              href="/"
              className="mt-5 inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-accent-dark"
            >
              العودة للرئيسية
            </Link>
          </div>
        )}

        {!authLoading && !loading && user && !denied && (
          <>
            <div className="mb-4 flex items-center justify-between border-b border-line pb-3">
              <h2 className="text-sm font-semibold text-ink">بلاغات مفتوحة</h2>
              <span className="text-sm text-muted">
                <span className="font-semibold text-ink nums">{reports.length}</span> بلاغ
              </span>
            </div>

            {reports.length === 0 ? (
              <div className="rounded-card border border-dashed border-line bg-white px-6 py-16 text-center">
                <Icon name="check" className="mx-auto h-9 w-9 text-emerald-400" strokeWidth={1.6} />
                <p className="mt-3 text-sm font-semibold text-ink">لا توجد بلاغات</p>
                <p className="mt-1 text-xs text-muted">كل شيء نظيف حالياً.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {reports.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-card border border-line bg-white p-4 shadow-card"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="flex items-center gap-2 text-sm font-semibold text-ink">
                          <Icon name="flag" className="h-4 w-4 shrink-0 text-accent" />
                          {REASON_LABELS[r.reason] || r.reason}
                        </p>
                        {r.details && (
                          <p className="mt-1.5 whitespace-pre-line text-xs leading-relaxed text-slate-600">
                            {r.details}
                          </p>
                        )}
                        <p className="mt-1.5 text-2xs text-muted">{timeAgo(r.created_at)}</p>
                      </div>

                      <Link
                        href={`/cars/${r.car_id}`}
                        target="_blank"
                        className="shrink-0 rounded-md border border-line px-3 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                      >
                        عرض الإعلان
                      </Link>
                    </div>

                    <div className="mt-3 flex gap-2 border-t border-line pt-3">
                      <button
                        type="button"
                        onClick={() => handleDeleteCar(r)}
                        disabled={busyId === r.id}
                        className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-md bg-accent py-2 text-xs font-semibold text-white transition hover:bg-accent-dark disabled:opacity-50 sm:flex-none sm:px-5"
                      >
                        <Icon name="trash" className="h-3.5 w-3.5" />
                        حذف الإعلان
                      </button>
                      <button
                        type="button"
                        onClick={() => handleIgnore(r.id)}
                        disabled={busyId === r.id}
                        className="rounded-md border border-line px-4 py-2 text-xs font-medium text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 disabled:opacity-50"
                      >
                        تجاهل البلاغ
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
