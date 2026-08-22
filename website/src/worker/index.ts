import { Hono } from "hono";
import { EducationApplicationSchema, TradingToolsApplicationSchema } from "@/shared/types";

const app = new Hono<{ Bindings: Env }>();

const CREATE_EDUCATION_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS education_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    complete_name TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram_or_whatsapp TEXT NOT NULL,
    trading_experience TEXT NOT NULL,
    program_willingness TEXT NOT NULL,
    trading_platform TEXT NOT NULL,
    to_learn TEXT NOT NULL,
    to_learn_other TEXT,
    participation TEXT,
    convenient_time TEXT,
    referred_by TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

const CREATE_TRADING_TOOLS_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS trading_tools_applications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    telegram_or_contact TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    looking_for TEXT NOT NULL,
    how_did_you_find_us TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )
`;

app.post("/api/education-applications", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const parsed = EducationApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const data = parsed.data;
  await c.env.DB.prepare(CREATE_EDUCATION_TABLE_SQL).run();
  await c.env.DB.prepare(
    `INSERT INTO education_applications (
      complete_name, email, telegram_or_whatsapp, trading_experience,
      program_willingness, trading_platform, to_learn, to_learn_other,
      participation, convenient_time, referred_by
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.completeName,
      data.email,
      data.telegramOrWhatsapp,
      JSON.stringify(data.tradingExperience),
      data.programWillingness,
      data.tradingPlatform,
      JSON.stringify(data.toLearn),
      data.toLearnOther || null,
      JSON.stringify(data.participation ?? []),
      JSON.stringify(data.convenientTime ?? []),
      data.referredBy
    )
    .run();

  return c.json({ ok: true });
});

app.post("/api/trading-tools-applications", async (c) => {
  let body: unknown;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: "Invalid JSON" }, 400);
  }

  const parsed = TradingToolsApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return c.json({ error: parsed.error.flatten() }, 400);
  }

  const data = parsed.data;
  await c.env.DB.prepare(CREATE_TRADING_TOOLS_TABLE_SQL).run();
  await c.env.DB.prepare(
    `INSERT INTO trading_tools_applications (
      name, email, telegram_or_contact, whatsapp, looking_for, how_did_you_find_us
    ) VALUES (?, ?, ?, ?, ?, ?)`
  )
    .bind(
      data.name,
      data.email,
      data.telegramOrContact,
      data.whatsapp,
      JSON.stringify(data.lookingFor),
      data.howDidYouFindUs
    )
    .run();

  return c.json({ ok: true });
});

export default app;
