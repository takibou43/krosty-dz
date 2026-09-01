'use client';

import { useState } from 'react';
import Icon from './Icon';
import { reportCar } from '@/utils/supabase';
import { useAuth } from '@/utils/useAuth';

const REASONS = [
  { value: 'fraud', label: 'احتيال أو نصب' },
  { value: 'sold', label: 'السيارة مباعة' },
  { value: 'wrong_info', label: 'معلومات خاطئة أو مضللة' },
  { value: 'duplicate', label: 'إعلان مكرر' },
  { value: 'offensive', label: 'محتوى مسيء' },
  { value: 'other', label: 'سبب آخر' },
];

export default function ReportDialog({ carId }) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason) {
      setError('اختر سبب البلاغ.');
      return;
    }
    setError(null);
    setSending(true);
    const ok = await reportCar({
      carId,
      reason,
      details: details.trim(),
      reporterId: user?.id || null,
    });
    setSending(false);
    if (ok) {
      setDone(true);
      setTimeout(() => setOpen(false), 2500);
    } else {
      setError('تعذّر إرسال البلاغ. حاول مرة أخرى.');
    }
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 text-2xs font-medium text-muted transition hover:text-accent"
      >
        <Icon name="flag" className="h-3.5 w-3.5" />
        الإبلاغ عن هذا الإعلان
      </button>
    );
  }

  return (
    <div className="rounded-card border border-line bg-white p-4 shadow-card">
      {done ? (
        <div className="py-4 text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <Icon name="check" className="h-5 w-5" strokeWidth={2.2} />
          </div>
          <p className="mt-3 text-sm font-semibold text-ink">وصل بلاغك</p>
          <p className="mt-1 text-2xs text-muted">سنراجعه في أقرب وقت. شكراً لمساعدتك.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h3 className="flex items-center gap-2 text-sm font-semibold text-ink">
              <Icon name="flag" className="h-4 w-4 text-accent" />
              الإبلاغ عن الإعلان
            </h3>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="إغلاق"
              className="text-slate-400 transition hover:text-ink"
            >
              <Icon name="close" className="h-4 w-4" />
            </button>
          </div>

          {error && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-2xs text-red-800">
              {error}
            </p>
          )}

          <div className="space-y-1.5">
            {REASONS.map((r) => (
              <label
                key={r.value}
                className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-xs text-slate-700 transition hover:bg-slate-50"
              >
                <input
                  type="radio"
                  name="report-reason"
                  value={r.value}
                  checked={reason === r.value}
                  onChange={(e) => setReason(e.target.value)}
                  className="accent-accent"
                />
                {r.label}
              </label>
            ))}
          </div>

          <textarea
            rows={2}
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="تفاصيل إضافية (اختياري)"
            maxLength={500}
            className="w-full resize-y rounded-md border border-line bg-white px-3 py-2 text-base text-ink transition placeholder:text-slate-400 focus:border-accent focus:outline-none md:text-sm"
          />

          <button
            type="submit"
            disabled={sending}
            className="w-full rounded-md bg-ink py-2.5 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-60"
          >
            {sending ? 'جاري الإرسال...' : 'إرسال البلاغ'}
          </button>
        </form>
      )}
    </div>
  );
}
