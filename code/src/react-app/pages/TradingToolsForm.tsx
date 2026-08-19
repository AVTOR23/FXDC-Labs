import { FormEvent, ReactNode, useState } from 'react';
import { Link } from 'react-router';
import { Check, Loader2 } from 'lucide-react';
import { TradingToolsApplicationSchema } from '@/shared/types';
import { apiRequest } from '@/react-app/lib/api';

const THEME = '#3370FF';

const LOOKING_FOR_OPTIONS = [
  'Exclusive Signals & Insights',
  'Copy Trading Set-up',
  'Agent007 Algo Trading Bot MT5',
  'FXDC A.i Quant Trading Bot',
  'AUM Account Management',
  'Community Participants',
  'Collab & Partnerships',
];

type FormState = {
  name: string;
  email: string;
  telegramOrContact: string;
  whatsapp: string;
  lookingFor: string[];
  howDidYouFindUs: string;
};

const INITIAL: FormState = {
  name: '',
  email: '',
  telegramOrContact: '',
  whatsapp: '',
  lookingFor: [],
  howDidYouFindUs: '',
};

function toggleValue(list: string[], value: string) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value];
}

function FieldCard({
  index,
  required,
  title,
  description,
  error,
  children,
}: {
  index: number;
  required?: boolean;
  title: string;
  description?: string;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(51,112,255,0.08)] sm:px-6">
      <div className="mb-4 flex gap-3">
        <span className="font-semibold tabular-nums" style={{ color: THEME }}>
          {required && <span className="mr-0.5 text-[#F54A45]">*</span>}
          {index}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-semibold leading-snug" style={{ color: THEME }}>
            {title}
          </p>
          {description && (
            <p className="mt-1 text-sm leading-relaxed text-[#646A73]">{description}</p>
          )}
        </div>
      </div>
      {children}
      {error && <p className="mt-2 text-sm text-[#F54A45]">{error}</p>}
    </div>
  );
}

function TextField({
  value,
  onChange,
  type = 'text',
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-11 w-full rounded-xl border border-[#E5E6EB] bg-[#F8F8FA] px-3 text-sm text-[#1F2329] outline-none transition-colors placeholder:text-[#8F959E] focus:border-[#3370FF] focus:bg-white focus:ring-4 focus:ring-[#3370FF]/10"
    />
  );
}

function OptionList({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className="flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors"
            style={{
              color: THEME,
              borderColor: active ? 'rgba(51, 112, 255, 0.45)' : '#E5E6EB',
              background: active ? 'rgba(51, 112, 255, 0.08)' : '#fff',
            }}
          >
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border"
              style={{
                borderColor: active ? THEME : 'rgba(51, 112, 255, 0.45)',
                background: active ? THEME : '#fff',
              }}
            >
              {active && <Check className="size-3 text-white" strokeWidth={3} />}
            </span>
            {option}
          </button>
        );
      })}
    </div>
  );
}

export default function TradingToolsForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
    setErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitError('');

    const parsed = TradingToolsApplicationSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? '');
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest('/api/trading-tools-applications', {
        method: 'POST',
        body: JSON.stringify(parsed.data),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'Could not submit the form.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-x-hidden text-[#1F2329]"
      style={{
        backgroundColor: '#EAF1FF',
        backgroundImage: 'url(/form/trading-tools-form-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#EAF1FF]/50" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-12 lg:px-10 lg:py-12">
        <div className="w-full">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#646A73] transition-colors hover:text-[#3370FF]"
          >
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-md object-cover" />
            Back to FXDC Academy
          </Link>

          <img
            src="/form/trading-tools-form-illustration.png"
            alt="Tools and Management"
            className="mb-6 w-full max-w-sm object-contain lg:hidden"
          />

          {submitted ? (
            <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(51,112,255,0.08)]">
              <div
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
                style={{ background: 'rgba(51, 112, 255, 0.08)' }}
              >
                <Check className="size-7" style={{ color: THEME }} />
              </div>
              <h1 className="font-display text-2xl font-bold" style={{ color: THEME }}>
                Submitted
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#646A73]">
                Thank you. Our team will contact you as soon as possible and reach out through invitations.
              </p>
              <Link
                to="/"
                className="mt-8 inline-flex h-11 items-center justify-center rounded-xl px-6 text-sm font-semibold text-white"
                style={{ background: THEME }}
              >
                Back to home
              </Link>
            </div>
          ) : (
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(51,112,255,0.08)] sm:px-6">
                <h1
                  className="font-display text-[28px] font-bold leading-tight whitespace-pre-line"
                  style={{ color: THEME }}
                >
                  (Tools & Management){'\n'}- Copy Trading{'\n'}- Signals{'\n'}- Automated Trading{'\n'}- Account Management AUM
                </h1>
                <p className="mt-4 text-sm leading-relaxed text-[#646A73]">
                  To support & assist you further, please fill out the form below to understand your requirements. Our team will contact you as soonest possible, & reach out through invitations.
                </p>
              </div>

              <FieldCard index={1} required title="Your Name" error={errors.name}>
                <TextField value={form.name} onChange={(value) => setField('name', value)} />
              </FieldCard>

              <FieldCard index={2} required title="Your Email Address" error={errors.email}>
                <TextField type="email" value={form.email} onChange={(value) => setField('email', value)} />
              </FieldCard>

              <FieldCard
                index={3}
                required
                title="Your Telegram ID or Contact"
                error={errors.telegramOrContact}
              >
                <TextField
                  value={form.telegramOrContact}
                  onChange={(value) => setField('telegramOrContact', value)}
                />
              </FieldCard>

              <FieldCard index={4} required title="Your WhatsApp number" error={errors.whatsapp}>
                <TextField value={form.whatsapp} onChange={(value) => setField('whatsapp', value)} />
              </FieldCard>

              <FieldCard index={5} required title="Your Looking For" error={errors.lookingFor}>
                <OptionList
                  options={LOOKING_FOR_OPTIONS}
                  selected={form.lookingFor}
                  onToggle={(value) => setField('lookingFor', toggleValue(form.lookingFor, value))}
                />
              </FieldCard>

              <FieldCard
                index={6}
                required
                title="How did you Find Us"
                description="Write name of the referral person if any."
                error={errors.howDidYouFindUs}
              >
                <TextField
                  value={form.howDidYouFindUs}
                  onChange={(value) => setField('howDidYouFindUs', value)}
                />
              </FieldCard>

              {submitError && <p className="px-1 text-sm text-[#F54A45]">{submitError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-70"
                style={{ background: THEME }}
              >
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Submit
              </button>
            </form>
          )}
        </div>

        <div className="sticky top-8 hidden lg:block">
          <img
            src="/form/trading-tools-form-illustration.png"
            alt="Tools and Management"
            className="mx-auto max-h-[70vh] w-full max-w-xl object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
