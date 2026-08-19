import { APPLICATION_STATUSES } from "../constants/options.js";
import { EducationApplication } from "../models/EducationApplication.js";
import { Media } from "../models/Media.js";
import { TradingToolsApplication } from "../models/TradingToolsApplication.js";
import { User } from "../models/User.js";

async function countByStatus(
  model: typeof EducationApplication | typeof TradingToolsApplication
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
    mediaTotal,
    usersTotal,
    adminsTotal,
    education,
    tradingTools,
  ] = await Promise.all([
    EducationApplication.countDocuments({ isDeleted: false }),
    TradingToolsApplication.countDocuments({ isDeleted: false }),
    Media.countDocuments(),
    User.countDocuments(),
    User.countDocuments({ role: { $in: ["admin", "superadmin"] } }),
    countByStatus(EducationApplication),
    countByStatus(TradingToolsApplication),
  ]);

  return {
    users: { total: usersTotal, admins: adminsTotal },
    education: { total: educationTotal, ...education },
    tradingTools: { total: tradingToolsTotal, ...tradingTools },
    media: { total: mediaTotal },
  };
}
