import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { Check, Loader2 } from "lucide-react";
import { useAuth } from "@/react-app/lib/auth";
import {
  attachWorkshopPayment,
  fetchMyWorkshopApplication,
  fetchPaymentStatus,
  type PaymentRecord,
  type WorkshopApplication,
} from "@/react-app/lib/payments";
import { getWorkshopApplicationId } from "@/react-app/lib/workshop";

const THEME = "#465399";

function RecapRow({ label, value }: { label: string; value?: string }) {
  return (
    <div className="rounded-2xl bg-white px-5 py-4 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#8F959E]">{label}</p>
      <p className="mt-2 text-sm font-medium" style={{ color: THEME }}>
        {value?.trim() ? value : "Not provided"}
      </p>
    </div>
  );
}

export default function PaymentRecap() {
  const { user, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("order") ?? "";
  const [loading, setLoading] = useState(true);
  const [payment, setPayment] = useState<PaymentRecord | null>(null);
  const [application, setApplication] = useState<WorkshopApplication | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      const storedApplicationId = getWorkshopApplicationId();

      const paymentPromise = orderId
        ? fetchPaymentStatus(orderId).catch(() => null)
        : Promise.resolve(null);

      const applicationPromise = user
        ? fetchMyWorkshopApplication(storedApplicationId || undefined).catch(() => null)
        : Promise.resolve(null);

      const [nextPayment, nextApplication] = await Promise.all([paymentPromise, applicationPromise]);
      if (!active) return;

      setPayment(nextPayment);
      setApplication(nextApplication);

      if (user && nextPayment && nextApplication) {
        try {
          const attached = await attachWorkshopPayment({
            merchantOrderId: nextPayment.merchantOrderId,
            paymentAmount: nextPayment.paidAmount || nextPayment.amount,
            courseTitle: nextPayment.courseTitle,
            applicationId: nextApplication.id,
          });
          if (active) setApplication(attached);
        } catch {
          // Recap can still render without attaching the order.
        }
      }

      if (active) setLoading(false);
    };

    if (!authLoading) {
      void load();
    }

    return () => {
      active = false;
    };
  }, [authLoading, orderId, user]);

  const amount = payment?.paidAmount || payment?.amount || application?.paymentAmount;
  const courseTitle = payment?.courseTitle || application?.courseTitle;
  const language =
    application?.language === "Other"
      ? application.languageOther || "Other"
      : application?.language;

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
        <div className="w-full space-y-4">
          <Link
            to="/account"
            className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-[#646A73] transition-colors hover:text-[#465399]"
          >
            <img src="/logo.png" alt="" className="h-8 w-8 rounded-md object-cover" />
            Back to FXDC Labs
          </Link>

          <div className="rounded-2xl bg-white px-5 py-6 shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8F959E]">
              Payment recap
            </p>
            <h1
              className="mt-2 font-display text-[28px] font-bold leading-tight"
              style={{ color: THEME }}
            >
              Trading workshop application recap
            </h1>
            <p className="mt-3 text-sm text-[#646A73]">
              {courseTitle ? `${courseTitle}` : "Your program"}
              {amount ? ` · $${amount}` : ""}
            </p>
          </div>

          {loading || authLoading ? (
            <div className="flex items-center gap-2 rounded-2xl bg-white px-5 py-6 text-[#646A73]">
              <Loader2 className="size-4 animate-spin" />
              Loading your recap...
            </div>
          ) : (
            <>
              <RecapRow label="1. Name / User Name" value={[application?.name || user?.name, application?.username || user?.username].filter(Boolean).join(" · ")} />
              <RecapRow label="2. Telegram ID" value={application?.telegram || user?.telegramWhatsapp} />
              <RecapRow label="3. WhatsApp" value={application?.whatsapp || user?.phone} />
              <RecapRow label="4. Email Address" value={application?.email || user?.email} />
              <RecapRow label="5. Training set-up" value={application?.trainingSetup} />
              <RecapRow label="6. Online training class workshop" value={application?.classSchedule} />
              <RecapRow label="7. On-site training class workshop" value={application?.onsiteClassSchedule} />
              <RecapRow label="8. Language" value={language} />
              <RecapRow label="9. Remarks comments" value={application?.remarks} />

              <div className="rounded-2xl bg-white px-5 py-5 text-sm leading-relaxed text-[#646A73] shadow-[0_8px_24px_rgba(70,83,153,0.06)] sm:px-6">
                <p>
                  Training class will be live and in case you&apos;re not able to attend, you may request a
                  recorded file from our official contact or channel.
                </p>
                <p className="mt-4 font-semibold" style={{ color: THEME }}>
                  ----------&gt;&gt;&gt;Good Luck&lt;&lt;&lt;----------
                </p>
              </div>
            </>
          )}

          <Link
            to={user ? "/account" : "/"}
            className="inline-flex h-12 w-full items-center justify-center rounded-xl text-sm font-bold uppercase tracking-widest text-white"
            style={{ background: THEME }}
          >
            <Check className="mr-2 size-4" />
            Finish
          </Link>
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
