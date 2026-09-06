import crypto from "crypto";

function valueAsString(value: unknown): string {
  if (value === null || value === undefined) {
    return "";
  }

  if (typeof value === "string") {
    return value;
  }

  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  if (Array.isArray(value)) {
    return value.map((item) => valueAsString(item)).join("");
  }

  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>)
      .map((item) => valueAsString(item))
      .join("");
  }

  return String(value);
}

export function toStringMap(data: Record<string, unknown>): Record<string, string> {
  const result: Record<string, string> = {};

  for (const [key, value] of Object.entries(data)) {
    result[key] = valueAsString(value);
  }

  return result;
}

export function buildSignString(params: Record<string, string>): string {
  const sortedKeys = Object.keys(params)
    .filter((key) => key !== "sign")
    .sort();

  return sortedKeys.map((key) => `${key}=${params[key]}`).join("&");
}

export function signPayload(data: Record<string, unknown>, privateKeyPem: string): string {
  const signString = buildSignString(toStringMap(data));
  const signer = crypto.createSign("md5WithRSAEncryption");
  signer.update(signString, "utf8");
  return signer.sign(normalizePrivateKey(privateKeyPem), "base64");
}

export function verifyPayloadSignature(
  data: Record<string, unknown>,
  signature: string,
  publicKeyPem: string
): boolean {
  if (!signature) {
    return false;
  }

  try {
    const signString = buildSignString(toStringMap(data));
    const verifier = crypto.createVerify("md5WithRSAEncryption");
    verifier.update(signString, "utf8");
    return verifier.verify(normalizePublicKey(publicKeyPem), signature, "base64");
  } catch {
    return false;
  }
}

function normalizePrivateKey(key: string): string {
  if (key.includes("BEGIN")) {
    return key.replace(/\\n/g, "\n");
  }

  return `-----BEGIN PRIVATE KEY-----\n${key.replace(/\\n/g, "\n")}\n-----END PRIVATE KEY-----`;
}

function normalizePublicKey(key: string): string {
  if (key.includes("BEGIN")) {
    return key.replace(/\\n/g, "\n");
  }

  return `-----BEGIN PUBLIC KEY-----\n${key.replace(/\\n/g, "\n")}\n-----END PUBLIC KEY-----`;
}
