import { FormEvent, ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useNavigate, useSearchParams } from "react-router";
import { ArrowRight, Loader2, Lock } from "lucide-react";
import {
  CLASS_SCHEDULE_OPTIONS,
  LANGUAGE_OPTIONS,
  LearningPathApplicationSchema,
  ONSITE_CLASS_SCHEDULE_OPTIONS,
  TRAINING_SETUP_OPTIONS,
} from "@/shared/types";
import { apiRequest } from "@/react-app/lib/api";
import { useAuth } from "@/react-app/lib/auth";
import { saveWorkshopApplicationId } from "@/react-app/lib/workshop";

const THEME = "#465399";

const PROGRAMS = [
  {
    id: "foundation",
    title: "Foundations",
    price: "$25",
    subtitle: "Master the Fundamentals",
    available: true,
  },
  {
    id: "advance",
    title: "Advanced",
    price: "$225",
    subtitle: "Institutional Precision",
    available: true,
  },
  {
    id: "masterclass",
    title: "Masterclass",
    price: "$885",
    subtitle: "Advanced Strategies & Methods",
    available: true,
  },
  {
    id: "enhancement",
    title: "Enhancement",
    price: "$$$",
    subtitle: "Early Access Program",
    available: false,
  },
] as const;

type FormState = {
  name: string;
  username: string;
  email: string;
  telegram: string;
  whatsapp: string;
  trainingSetup: string;
  classSchedule: string;
  onsiteClassSchedule: string;
  language: string;
  languageOther: string;
  remarks: string;
};

const INITIAL: FormState = {
  name: "",
  username: "",
  email: "",
  telegram: "",
  whatsapp: "",
  trainingSetup: "",
  classSchedule: "",
  onsiteClassSchedule: "",
  language: "",
  languageOther: "",
  remarks: "",
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

export default function WorkshopApply() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const presetCourse = searchParams.get("course") ?? "";
  const [step, setStep] = useState<"form" | "courses">("form");
  const [form, setForm] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    setForm((current) => ({
      ...current,
      name: current.name || user?.name || "",
      username: current.username || user?.username || "",
      email: current.email || user?.email || "",
      telegram: current.telegram || user?.telegramWhatsapp || "",
      whatsapp: current.whatsapp || user?.phone || "",
    }));
  }, [user]);

  if (!loading && user) {
    const next =
      presetCourse && presetCourse !== "enhancement"
        ? `/checkout/${presetCourse}`
        : "/account";
    return <Navigate to={next} replace />;
  }

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
      const response = await apiRequest<{ id: string }>("/api/learning-path-applications", {
        method: "POST",
        body: JSON.stringify(parsed.data),
      });
      saveWorkshopApplicationId(response.data.id);
      if (presetCourse && presetCourse !== "enhancement") {
        navigate(`/checkout/${presetCourse}`);
        return;
      }
      setStep("courses");
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
            alt="Online trading workshop"
            className="mb-6 w-full max-w-sm object-contain lg:hidden"
          />

          {step === "courses" ? (
            <div className="space-y-4">
              <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8F959E]">
                  Step 2 · Choose program course
                </p>
                <h1
                  className="mt-2 font-display text-[28px] font-bold leading-tight"
                  style={{ color: THEME }}
                >
                  Choose Program Course
                </h1>
                <p className="mt-3 text-sm text-[#646A73]">
                  Foundations $25 · Advanced $225 · Masterclass $885 · Enhancement $$$
                </p>
              </div>

              <div className="grid gap-3">
                {PROGRAMS.map((program) =>
                  program.available ? (
                    <Link
                      key={program.id}
                      to={`/checkout/${program.id}`}
                      className="flex items-center justify-between rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgba(70,83,153,0.06)] transition-transform hover:-translate-y-0.5"
                    >
                      <div>
                        <p className="font-display text-lg font-bold" style={{ color: THEME }}>
                          {program.title}
                        </p>
                        <p className="text-sm text-[#646A73]">{program.subtitle}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 font-display text-xl font-bold" style={{ color: THEME }}>
                        {program.price}
                        <ArrowRight className="size-4" />
                      </span>
                    </Link>
                  ) : (
                    <div
                      key={program.id}
                      className="flex items-center justify-between rounded-2xl bg-white/80 px-5 py-4 text-[#8F959E]"
                    >
                      <div>
                        <p className="font-display text-lg font-bold">{program.title}</p>
                        <p className="text-sm">{program.subtitle}</p>
                      </div>
                      <span className="inline-flex items-center gap-2 font-semibold">
                        <Lock className="size-4" />
                        Coming soon
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={(event) => void onSubmit(event)} className="space-y-4">
              <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8F959E]">
                  Step 1 · Application form
                </p>
                <h1
                  className="mt-2 font-display text-[28px] font-bold leading-tight whitespace-pre-line"
                  style={{ color: THEME }}
                >
                  Online Trading Workshop{"\n"}(Forex CFD&apos;s & Crypto)
                </h1>
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

              <FieldCard index={2} required title="Telegram ID" error={errors.telegram}>
                <TextField
                  value={form.telegram}
                  onChange={(value) => setField("telegram", value)}
                  placeholder="@username"
                />
              </FieldCard>

              <FieldCard index={3} required title="WhatsApp" error={errors.whatsapp}>
                <TextField
                  value={form.whatsapp}
                  onChange={(value) => setField("whatsapp", value)}
                  placeholder="WhatsApp number"
                />
              </FieldCard>

              <FieldCard index={4} required title="Email Address" error={errors.email}>
                <TextField
                  type="email"
                  value={form.email}
                  onChange={(value) => setField("email", value)}
                  placeholder="you@email.com"
                />
              </FieldCard>

              <FieldCard
                index={5}
                required
                title="Choose your desired training set-up"
                description="Online class, or in-class tickets will be notified by availability."
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
                index={6}
                required
                title="Choose your online training class workshop"
                error={errors.classSchedule}
              >
                <OptionList
                  options={CLASS_SCHEDULE_OPTIONS}
                  selected={form.classSchedule}
                  onSelect={(value) => setField("classSchedule", value)}
                />
              </FieldCard>

              <FieldCard
                index={7}
                title="Choose your on-site training class workshop (Guests)"
                error={errors.onsiteClassSchedule}
              >
                <OptionList
                  options={ONSITE_CLASS_SCHEDULE_OPTIONS}
                  selected={form.onsiteClassSchedule}
                  onSelect={(value) => setField("onsiteClassSchedule", value)}
                />
              </FieldCard>

              <FieldCard index={8} required title="Language" error={errors.language || errors.languageOther}>
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

              <FieldCard index={9} title="Remarks comments" error={errors.remarks}>
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
                  Training class will be live and in case you&apos;re not able to attend, you may request a
                  recorded file from our official contact or channel.
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
