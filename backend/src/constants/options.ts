export const APPLICATION_STATUSES = ["pending", "reviewed", "contacted", "closed"] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const TRADING_EXPERIENCE_OPTIONS = ["Yes", "No", "Idea"] as const;

export const LEARN_OPTIONS = [
  "Forex Trading Professional Program",
  "Crypto Trading Professional Program",
  "Forex  and Crypto Trading Program",
  "Master Class (Strategies & Set-up)",
  "Other",
] as const;

export const PARTICIPATION_OPTIONS = [
  "Online - Zoom / Meet",
  "Face to Face Dubai / On-site",
  "Both Ready",
] as const;

export const CONVENIENT_TIME_OPTIONS = [
  "Weekend Saturday Sunday",
  "Weekdays Mon - Fri",
  "18:00 PM Onwards",
  "10:00 AM Onwards",
] as const;

export const LOOKING_FOR_OPTIONS = [
  "Exclusive Signals & Insights",
  "Copy Trading Set-up",
  "Agent007 Algo Trading Bot MT5",
  "FXDC A.i Quant Trading Bot",
  "AUM Account Management",
  "Community Participants",
  "Collab & Partnerships",
] as const;

export const DUPLICATE_WINDOW_MS = 24 * 60 * 60 * 1000;
