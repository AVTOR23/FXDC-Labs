import { FormEvent, ReactNode, useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Check, Loader2 } from 'lucide-react';
import { EducationApplicationSchema } from '@/shared/types';

const THEME = '#465399';

const EXPERIENCE_OPTIONS = ['Yes', 'No', 'Idea'];
const LEARN_OPTIONS = [
  'Forex Trading Professional Program',
  'Crypto Trading Professional Program',
  'Forex  and Crypto Trading Program',
  'Master Class (Strategies & Set-up)',
  'Other',
];
const PARTICIPATION_OPTIONS = [
  'Online - Zoom / Meet',
  'Face to Face Dubai / On-site',
  'Both Ready',
];
const TIME_OPTIONS = [
  'Weekend Saturday Sunday',
  'Weekdays Mon - Fri',
  '18:00 PM Onwards',
  '10:00 AM Onwards',
];

type FormState = {
  completeName: string;
  email: string;
  telegramOrWhatsapp: string;
  tradingExperience: string[];
  programWillingness: string;
  tradingPlatform: string;
  toLearn: string[];
  toLearnOther: string;
  participation: string[];
  convenientTime: string[];
  referredBy: string;
};

const INITIAL: FormState = {
  completeName: '',
  email: '',
  telegramOrWhatsapp: '',
  tradingExperience: [],
  programWillingness: '',
  tradingPlatform: '',
  toLearn: [],
  toLearnOther: '',
  participation: [],
  convenientTime: [],
  referredBy: '',
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
    <div className="rounded-2xl bg-white px-5 py-5 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
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
  placeholder,
}: {
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-11 w-full rounded-xl border border-[#E5E6EB] bg-[#F8F8FA] px-3 text-sm text-[#1F2329] outline-none transition-colors placeholder:text-[#8F959E] focus:border-[#465399] focus:bg-white focus:ring-4 focus:ring-[#465399]/10"
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
              borderColor: active ? 'rgba(70, 83, 153, 0.4)' : '#E5E6EB',
              background: active ? 'rgba(70, 83, 153, 0.08)' : '#fff',
            }}
          >
            <span
              className="flex size-4 shrink-0 items-center justify-center rounded-[5px] border"
              style={{
                borderColor: active ? THEME : 'rgba(70, 83, 153, 0.4)',
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

export default function EducationForm() {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const showOther = useMemo(() => form.toLearn.includes('Other'), [form.toLearn]);

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

    const parsed = EducationApplicationSchema.safeParse(form);
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
      const response = await fetch('/api/education-applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(parsed.data),
      });
      if (!response.ok) {
        throw new Error('Could not submit the form. Please try again.');
      }
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
        backgroundColor: '#F4EFE4',
        backgroundImage: 'url(/form/education-form-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[#F4EFE4]/55" />

      <div className="relative mx-auto grid min-h-screen max-w-6xl items-start gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,560px)_1fr] lg:gap-12 lg:px-10 lg:py-12">
        <div className="w-full">
          <Link
            to="/"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[#646A73] transition-colors hover:text-[#465399]"
          >
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-md object-cover" />
            Back to FXDC Academy
          </Link>

          <img
            src="/form/education-form-illustration.png"
            alt="Academic Trading Program"
            className="mb-6 w-full max-w-sm object-contain lg:hidden"
          />

          {submitted ? (
            <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(70,83,153,0.06)]">
              <div
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
                style={{ background: 'rgba(70, 83, 153, 0.08)' }}
              >
                <Check className="size-7" style={{ color: THEME }} />
              </div>
              <h1 className="font-display text-2xl font-bold" style={{ color: THEME }}>
                Submitted
              </h1>
              <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-[#646A73]">
                Welcome to FXDC Academy -{'\n'}
                Our team will connect surely, once majority vote filed completed. Thank you!
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
              <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <h1
                  className="font-display text-[28px] font-bold leading-tight whitespace-pre-line"
                  style={{ color: THEME }}
                >
                  Academic Trading Program{'\n'}(Forex & Digital Currency)
                </h1>
              </div>

              <FieldCard index={1} required title="Complete Name" error={errors.completeName}>
                <TextField value={form.completeName} onChange={(value) => setField('completeName', value)} />
              </FieldCard>

              <FieldCard index={2} required title="Your Email Address" error={errors.email}>
                <TextField
                  type="email"
                  value={form.email}
                  onChange={(value) => setField('email', value)}
                />
              </FieldCard>

              <FieldCard
                index={3}
                required
                title="Your Telegram ID or Whatsapp"
                error={errors.telegramOrWhatsapp}
              >
                <TextField
                  value={form.telegramOrWhatsapp}
                  onChange={(value) => setField('telegramOrWhatsapp', value)}
                />
              </FieldCard>

              <FieldCard
                index={4}
                required
                title="Do you have any trading experience?"
                error={errors.tradingExperience}
              >
                <OptionList
                  options={EXPERIENCE_OPTIONS}
                  selected={form.tradingExperience}
                  onToggle={(value) => setField('tradingExperience', toggleValue(form.tradingExperience, value))}
                />
              </FieldCard>

              <FieldCard
                index={5}
                required
                title="The Program is all about Basics & Fundamentals (Covering Intermmediate & Advanced)"
                description="Are you willing to Participate? If you are Advanced & Professional we suggest you to choose the Master Class"
                error={errors.programWillingness}
              >
                <TextField
                  value={form.programWillingness}
                  onChange={(value) => setField('programWillingness', value)}
                />
              </FieldCard>

              <FieldCard
                index={6}
                required
                title="Your existing Trading Platform"
                description="Name of the Broker or Exchanges"
                error={errors.tradingPlatform}
              >
                <TextField
                  value={form.tradingPlatform}
                  onChange={(value) => setField('tradingPlatform', value)}
                />
              </FieldCard>

              <FieldCard
                index={7}
                required
                title="To Learn & Improve"
                error={errors.toLearn || errors.toLearnOther}
              >
                <OptionList
                  options={LEARN_OPTIONS}
                  selected={form.toLearn}
                  onToggle={(value) => setField('toLearn', toggleValue(form.toLearn, value))}
                />
                {showOther && (
                  <div className="mt-3">
                    <TextField
                      placeholder="Please specify"
                      value={form.toLearnOther}
                      onChange={(value) => setField('toLearnOther', value)}
                    />
                  </div>
                )}
              </FieldCard>

              <FieldCard
                index={8}
                title="Your preference participation?"
                description="Select most convenient one"
                error={errors.participation}
              >
                <OptionList
                  options={PARTICIPATION_OPTIONS}
                  selected={form.participation}
                  onToggle={(value) => setField('participation', toggleValue(form.participation, value))}
                />
              </FieldCard>

              <FieldCard index={9} title="Most Convenient Time" error={errors.convenientTime}>
                <OptionList
                  options={TIME_OPTIONS}
                  selected={form.convenientTime}
                  onToggle={(value) => setField('convenientTime', toggleValue(form.convenientTime, value))}
                />
              </FieldCard>

              <FieldCard index={10} required title="Referred by" error={errors.referredBy}>
                <TextField value={form.referredBy} onChange={(value) => setField('referredBy', value)} />
              </FieldCard>

              {submitError && (
                <p className="px-1 text-sm text-[#F54A45]">{submitError}</p>
              )}

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
            src="/form/education-form-illustration.png"
            alt="Academic Trading Program"
            className="mx-auto max-h-[70vh] w-full max-w-xl object-contain drop-shadow-xl"
          />
        </div>
      </div>
    </div>
  );
}
