import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Loader2 } from "lucide-react";
import {
  CLASS_SCHEDULE_OPTIONS,
  LANGUAGE_OPTIONS,
  LearningPathApplicationSchema,
  TRAINING_SETUP_OPTIONS,
} from "@/shared/types";
import { apiRequest } from "@/react-app/lib/api";
import { useAuth } from "@/react-app/lib/auth";
import { fetchPaymentStatus } from "@/react-app/lib/payments";

const THEME = "#465399";

type FormState = {
  name: string;
  username: string;
  telegram: string;
  trainingSetup: string;
  classSchedule: string;
  language: string;
  languageOther: string;
  remarks: string;
  merchantOrderId: string;
  paymentAmount: string;
  courseTitle: string;
};

const INITIAL: FormState = {
  name: "",
  username: "",
  telegram: "",
  trainingSetup: "",
  classSchedule: "",
  language: "",
  languageOther: "",
  remarks: "",
  merchantOrderId: "",
  paymentAmount: "",
  courseTitle: "",
};

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
  type = "text",
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
  onSelect,
  notes,
}: {
  options: readonly string[];
  selected: string;
  onSelect: (value: string) => void;
  notes?: Record<string, string>;
}) {
  return (
    <div className="space-y-2">
      {options.map((option) => {
        const active = selected === option;
        return (
          <button
            key={option}
            type="button"
            onClick={() => onSelect(option)}
            className="flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors"
            style={{
              color: THEME,
              borderColor: active ? "rgba(70, 83, 153, 0.4)" : "#E5E6EB",
              background: active ? "rgba(70, 83, 153, 0.08)" : "#fff",
            }}
          >
            <span
              className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border"
              style={{
                borderColor: active ? THEME : "rgba(70, 83, 153, 0.4)",
              }}
            >
              {active && <span className="size-2 rounded-full" style={{ background: THEME }} />}
            </span>
            <span>
              {option}
              {notes?.[option] && (
                <span className="mt-0.5 block text-xs text-[#646A73]">{notes[option]}</span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default function LearningPathApplication() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";
  const [form, setForm] = useState<FormState>({
    ...INITIAL,
    merchantOrderId: orderId,
    name: user?.name ?? "",
    username: user?.username ?? "",
    telegram: user?.telegramWhatsapp ?? user?.phone ?? "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || user?.name || "",
      username: current.username || user?.username || "",
      telegram: current.telegram || user?.telegramWhatsapp || user?.phone || "",
    }));
  }, [user]);

  useEffect(() => {
    if (!orderId) return;

    fetchPaymentStatus(orderId)
      .then((payment) => {
        setForm((current) => ({
          ...current,
          merchantOrderId: orderId,
          paymentAmount: payment.paidAmount || payment.amount || "",
          courseTitle: payment.courseTitle || "",
        }));
      })
      .catch(() => undefined);
  }, [orderId]);

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
    setSubmitError("");

    const parsed = LearningPathApplicationSchema.safeParse(form);
    if (!parsed.success) {
      const next: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "");
        if (key && !next[key]) next[key] = issue.message;
      }
      setErrors(next);
      return;
    }

    setSubmitting(true);
    try {
      await apiRequest("/api/learning-path-applications", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      setSubmitted(true);
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Could not submit the form.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-[#F4EFE4]"
      style={{
        backgroundImage: "url(/form/education-form-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
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
            Back to FXDC Labs
          </Link>

          <img
            src="/form/education-form-illustration.png"
            alt="Learning Path Trading Application"
            className="mb-6 w-full max-w-sm object-contain lg:hidden"
          />

          {submitted ? (
            <div className="rounded-2xl bg-white px-6 py-10 text-center shadow-[0_8px_24px_rgba(70,83,153,0.06)]">
              <div
                className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full"
                style={{ background: "rgba(70, 83, 153, 0.08)" }}
              >
                <Check className="size-7" style={{ color: THEME }} />
              </div>
              <h1 className="font-display text-2xl font-bold" style={{ color: THEME }}>
                Application received
              </h1>
              <p className="mt-4 text-sm leading-relaxed text-[#646A73]">
                Our team will review your recap and confirm your class schedule. Good luck on your
                learning path.
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
            <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
              <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8F959E]">
                  Step 2–3 · Application recap & schedule
                </p>
                <h1
                  className="mt-2 font-display text-[28px] font-bold leading-tight whitespace-pre-line"
                  style={{ color: THEME }}
                >
                  Learning Path Trading Application{"\n"}(Forex CFD's & Crypto)
                </h1>
                {form.courseTitle && (
                  <p className="mt-3 text-sm text-[#646A73]">
                    Program: {form.courseTitle}
                    {form.paymentAmount ? ` · $${form.paymentAmount}` : ""}
                  </p>
                )}
              </div>

              <FieldCard index={1} required title="Name / User Name" error={errors.name || errors.username}>
                <div className="space-y-3">
                  <TextField
                    value={form.name}
                    onChange={(value) => setField("name", value)}
                    placeholder="Full name"
                  />
                  <TextField
                    value={form.username}
                    onChange={(value) => setField("username", value)}
                    placeholder="Username"
                  />
                </div>
              </FieldCard>

              <FieldCard index={2} required title="Telegram" error={errors.telegram}>
                <TextField
                  value={form.telegram}
                  onChange={(value) => setField("telegram", value)}
                  placeholder="@username"
                />
              </FieldCard>

              <FieldCard
                index={3}
                required
                title="Choose your desired training set-up"
                error={errors.trainingSetup}
              >
                <OptionList
                  options={TRAINING_SETUP_OPTIONS}
                  selected={form.trainingSetup}
                  onSelect={(value) => setField("trainingSetup", value)}
                  notes={{ "Face to Face": "You will be notified by availability" }}
                />
              </FieldCard>

              <FieldCard
                index={4}
                required
                title="Choose your Online Class Time / Schedule"
                error={errors.classSchedule}
              >
                <OptionList
                  options={CLASS_SCHEDULE_OPTIONS}
                  selected={form.classSchedule}
                  onSelect={(value) => setField("classSchedule", value)}
                />
              </FieldCard>

              <FieldCard index={5} required title="Language" error={errors.language || errors.languageOther}>
                <OptionList
                  options={LANGUAGE_OPTIONS}
                  selected={form.language}
                  onSelect={(value) => setField("language", value)}
                />
                {form.language === "Other" && (
                  <div className="mt-3">
                    <TextField
                      value={form.languageOther}
                      onChange={(value) => setField("languageOther", value)}
                      placeholder="Please specify"
                    />
                  </div>
                )}
              </FieldCard>

              <FieldCard index={6} title="Remarks comments" error={errors.remarks}>
                <textarea
                  value={form.remarks}
                  onChange={(event) => setField("remarks", event.target.value)}
                  rows={4}
                  placeholder="Add any comments for our team"
                  className="w-full resize-none rounded-xl border border-[#E5E6EB] bg-[#F8F8FA] px-3 py-3 text-sm text-[#1F2329] outline-none transition-colors placeholder:text-[#8F959E] focus:border-[#465399] focus:bg-white focus:ring-4 focus:ring-[#465399]/10"
                />
              </FieldCard>

              <div className="rounded-2xl bg-white px-5 py-5 text-sm leading-relaxed text-[#646A73] shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <p>
                  Training class will be live and in case you're not able to attend, you may request a
                  recorded file from our official contact or channel.
                </p>
                <p className="mt-3">
                  Each learning path requires a passing score to obtain the digital badge.
                </p>
                <p className="mt-4 font-semibold" style={{ color: THEME }}>
                  ----------&gt;&gt;&gt;Good Luck&lt;&lt;&lt;----------
                </p>
              </div>

              {submitError && <p className="text-sm text-[#F54A45]">{submitError}</p>}

              <button
                type="submit"
                disabled={submitting}
                className="inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-widest text-white disabled:opacity-60"
                style={{ background: THEME }}
              >
                {submitting ? <Loader2 className="size-5 animate-spin" /> : "Submit"}
              </button>
            </form>
          )}
        </div>

        <div className="hidden lg:sticky lg:top-12 lg:block">
          <img
            src="/form/education-form-illustration.png"
            alt=""
            className="w-full max-w-lg object-contain"
          />
        </div>
      </div>
    </div>
  );
}
