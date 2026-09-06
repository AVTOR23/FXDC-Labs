import { APPLICATION_STATUSES } from "../constants/options.js";
import { ContactSubmission } from "../models/ContactSubmission.js";
import { EducationApplication } from "../models/EducationApplication.js";
import { Media } from "../models/Media.js";
import { Payment } from "../models/Payment.js";
import { TradingToolsApplication } from "../models/TradingToolsApplication.js";
import { User } from "../models/User.js";

async function countByStatus(
  model: typeof EducationApplication | typeof TradingToolsApplication | typeof ContactSubmission
) {
  const counts = await Promise.all(
    APPLICATION_STATUSES.map((status) =>
      model.countDocuments({ isDeleted: false, status })
    )
  );

  return APPLICATION_STATUSES.reduce<Record<string, number>>((acc, status, index) => {
    acc[status] = counts[index] ?? 0;
    return acc;
  }, {});
}

export async function getDashboardStats() {
  const [
    educationTotal,
    tradingToolsTotal,
    contactTotal,
    mediaTotal,
    usersTotal,
    adminsTotal,
    paymentsTotal,
    paymentsPendingReview,
    education,
    tradingTools,
    contact,
  ] = await Promise.all([
    EducationApplication.countDocuments({ isDeleted: false }),
    TradingToolsApplication.countDocuments({ isDeleted: false }),
    ContactSubmission.countDocuments({ isDeleted: false }),
    Media.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: { $in: ["admin", "superadmin"] } }),
    Payment.countDocuments({ isDeleted: false }),
    Payment.countDocuments({ isDeleted: false, reviewStatus: "pending_review" }),
    countByStatus(EducationApplication),
    countByStatus(TradingToolsApplication),
    countByStatus(ContactSubmission),
  ]);

  return {
    users: { total: usersTotal, admins: adminsTotal },
    education: { total: educationTotal, ...education },
    tradingTools: { total: tradingToolsTotal, ...tradingTools },
    contact: { total: contactTotal, ...contact },
    media: { total: mediaTotal },
    payments: { total: paymentsTotal, pendingReview: paymentsPendingReview },
  };
}
