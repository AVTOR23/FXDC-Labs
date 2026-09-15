export const FAME_LEVELS = [
  { id: "foundation", label: "Foundations", short: "F", stars: 1 },
  { id: "advance", label: "Advanced", short: "A", stars: 2 },
  { id: "masterclass", label: "Masterclass", short: "M", stars: 3 },
  { id: "enhancement", label: "Enhancement", short: "E", stars: 4 },
] as const;

export type FameLevelId = (typeof FAME_LEVELS)[number]["id"];

export type FeatureValue = boolean | string;

export type FeatureRow = {
  name: string;
  values: Record<FameLevelId, FeatureValue | null>;
};

const yes = true;
const no = null;

export const FOREX_PROGRAM_FEATURES: FeatureRow[] = [
  {
    name: "Community Circle",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Copy Trading (Mirror)",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Public Signals",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Private Signals Access",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Mirror Trading 3-5 Star Rank Trader Private (Coming Soon)",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Learning Assessment & Test",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Group or One on One Coaching Training Program",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Inner Circle Trading Group (VIP)",
    values: { foundation: no, advance: no, masterclass: no, enhancement: yes },
  },
  {
    name: "Airdrops Alert",
    values: {
      foundation: "Tier 1 (1 Star Project)",
      advance: "Tier 2 (2 Star Project)",
      masterclass: "Tier 3 (3 Stars Project)",
      enhancement: "Tier 4 (4 Star Project)",
    },
  },
  {
    name: "Advanced Indicator",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Basic EA Advisor (Coming Soon)",
    values: { foundation: no, advance: no, masterclass: no, enhancement: no },
  },
  {
    name: "Crypto 101 Principles (Foundations Class - Coming Soon)",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "On/Off Ramp Buy & Sell",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "OTC Crypto",
    values: {
      foundation: "10K volume",
      advance: "10K volume",
      masterclass: "10K – 50K volume",
      enhancement: "10K – 100K volume",
    },
  },
  {
    name: "Digital Certifications",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "NFT Certifications (Eligibility)",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Digital Wallet (Non-Custodial)",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "KYC Level Verified",
    values: {
      foundation: "1 star",
      advance: "2 star",
      masterclass: "3 star badge",
      enhancement: "4 star badge",
    },
  },
];

export const CRYPTO_PROGRAM_FEATURES: FeatureRow[] = [
  {
    name: "Community Circle",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Public Signals",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Copy Trading (Mirror)",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Mirror Trading 3-5 Star Rank Trader Private (Coming Soon)",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Learning Assessment & Test",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "Group or One on One Coaching Training Program",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "Inner Circle Trading Group (VIP)",
    values: { foundation: no, advance: no, masterclass: no, enhancement: yes },
  },
  {
    name: "Airdrops Alert",
    values: {
      foundation: "Tier 1 (1 Star Project)",
      advance: "Tier 2 (2 Star Project)",
      masterclass: "Tier 3 (3 Stars Project)",
      enhancement: "Tier 4 (4 Star Project)",
    },
  },
  {
    name: "On/Off Ramp Buy & Sell",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
  {
    name: "OTC Crypto",
    values: {
      foundation: "10K volume",
      advance: "10K volume",
      masterclass: "10K – 50K volume",
      enhancement: "10K – 100K volume",
    },
  },
  {
    name: "Digital Certifications",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "NFT Certifications (Eligibility)",
    values: { foundation: no, advance: no, masterclass: yes, enhancement: yes },
  },
  {
    name: "KYC Level Verified",
    values: {
      foundation: "1 star",
      advance: "2 star",
      masterclass: "3 star badge",
      enhancement: "4 star badge",
    },
  },
  {
    name: "Digital Wallet (Non-Custodial)",
    values: { foundation: yes, advance: yes, masterclass: yes, enhancement: yes },
  },
];

export const PROGRAM_TRACKS = [
  {
    id: "forex",
    title: "Forex, Indices, Stocks & Commodities",
    subtitle: "Training Program",
    features: FOREX_PROGRAM_FEATURES,
  },
  {
    id: "crypto",
    title: "Crypto · Web3 · Blockchain (CEX)",
    subtitle: "Spot / Futures / Leverage / Derivatives",
    features: CRYPTO_PROGRAM_FEATURES,
  },
] as const;
