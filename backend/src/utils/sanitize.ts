const CONTROL_CHARS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const SCRIPT_TAGS = /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi;
const HTML_TAGS = /<\/?[^>]+>/g;

export function sanitizeString(value: string): string {
  return value
    .replace(CONTROL_CHARS, "")
    .replace(SCRIPT_TAGS, "")
    .replace(HTML_TAGS, "")
    .trim();
}

export function sanitizeValue(value: unknown): unknown {
  if (typeof value === "string") {
    return sanitizeString(value);
  }

  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      next[key] = sanitizeValue(nested);
    }
    return next;
  }

  return value;
}
