import { prisma } from "@/lib/prisma";
import { payment as defaultPayment } from "@/content/brand";
import fs from "fs";
import path from "path";

export interface PaymentConfig {
  vodafoneCash: string[];
  instapay: string[];
  supportWhatsapp: string;
  supportEmail: string;
  activationHours: number;
}

const SETTING_KEY = "payment_config";
const CACHE_FILE = path.join(process.cwd(), "src", "content", "payment-config-cache.json");

let memoryCache: PaymentConfig | null = null;
let memoryCacheTime = 0;
const CACHE_TTL_MS = 10000; // 10 seconds memory cache in production

export function getDefaultPaymentConfig(): PaymentConfig {
  return {
    vodafoneCash: [...defaultPayment.vodafoneCash],
    instapay: [...defaultPayment.instapay],
    supportWhatsapp: defaultPayment.supportWhatsapp,
    supportEmail: defaultPayment.supportEmail,
    activationHours: defaultPayment.activationHours,
  };
}

function loadDiskCache(): PaymentConfig | null {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf8");
      const data = JSON.parse(raw);
      if (
        data &&
        Array.isArray(data.vodafoneCash) &&
        data.vodafoneCash.length > 0 &&
        Array.isArray(data.instapay) &&
        data.instapay.length > 0
      ) {
        return {
          vodafoneCash: data.vodafoneCash.map((v: unknown) => String(v).trim()).filter(Boolean),
          instapay: data.instapay.map((v: unknown) => String(v).trim()).filter(Boolean),
          supportWhatsapp: String(data.supportWhatsapp || defaultPayment.supportWhatsapp).trim(),
          supportEmail: String(data.supportEmail || defaultPayment.supportEmail).trim(),
          activationHours: Number(data.activationHours) || defaultPayment.activationHours,
        };
      }
    }
  } catch {
    /* ignore disk read failure */
  }
  return null;
}

function saveDiskCache(cfg: PaymentConfig) {
  try {
    const dir = path.dirname(CACHE_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cfg, null, 2), "utf8");
  } catch {
    /* ignore disk write failure in read-only runtimes */
  }
}

/**
 * Ensures the SystemSetting table exists in MySQL without requiring manual migrations.
 */
async function ensureSettingTable(): Promise<void> {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS SystemSetting (
      \`key\` VARCHAR(191) NOT NULL PRIMARY KEY,
      \`value\` MEDIUMTEXT NOT NULL,
      \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3) ON UPDATE CURRENT_TIMESTAMP(3)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

/**
 * Retrieves the current active payment gateway numbers and support contacts.
 * DB-First -> Local Cache -> Default Brand Fallback.
 */
export async function getPaymentConfig(): Promise<PaymentConfig> {
  const now = Date.now();
  if (memoryCache && now - memoryCacheTime < CACHE_TTL_MS) {
    return memoryCache;
  }

  // 1. Try DB read
  try {
    await ensureSettingTable();
    const rows = await prisma.$queryRaw<Array<{ key: string; value: string }>>`
      SELECT \`key\`, \`value\` FROM SystemSetting WHERE \`key\` = ${SETTING_KEY} LIMIT 1
    `;

    if (rows && rows.length > 0 && rows[0]?.value) {
      const parsed = JSON.parse(rows[0].value);
      const config: PaymentConfig = {
        vodafoneCash:
          Array.isArray(parsed.vodafoneCash) && parsed.vodafoneCash.length > 0
            ? parsed.vodafoneCash.map((v: unknown) => String(v).trim()).filter(Boolean)
            : [...defaultPayment.vodafoneCash],
        instapay:
          Array.isArray(parsed.instapay) && parsed.instapay.length > 0
            ? parsed.instapay.map((v: unknown) => String(v).trim()).filter(Boolean)
            : [...defaultPayment.instapay],
        supportWhatsapp:
          typeof parsed.supportWhatsapp === "string" && parsed.supportWhatsapp.trim()
            ? parsed.supportWhatsapp.trim()
            : defaultPayment.supportWhatsapp,
        supportEmail:
          typeof parsed.supportEmail === "string" && parsed.supportEmail.trim()
            ? parsed.supportEmail.trim()
            : defaultPayment.supportEmail,
        activationHours:
          typeof parsed.activationHours === "number" && parsed.activationHours > 0
            ? parsed.activationHours
            : defaultPayment.activationHours,
      };

      memoryCache = config;
      memoryCacheTime = now;
      saveDiskCache(config);
      return config;
    }
  } catch (err) {
    // Expected during offline build or when DB credentials are unreachable
    // console.warn("[payment-config] Database read bypassed:", err);
  }

  // 2. Try Disk Cache
  const disk = loadDiskCache();
  if (disk) {
    memoryCache = disk;
    memoryCacheTime = now;
    return disk;
  }

  // 3. Fallback to Brand Defaults
  const fallback = getDefaultPaymentConfig();
  memoryCache = fallback;
  memoryCacheTime = now;
  return fallback;
}

/**
 * Updates payment numbers and settings. Persists to MySQL & local disk cache.
 */
export async function updatePaymentConfig(newConfig: Partial<PaymentConfig>): Promise<PaymentConfig> {
  const current = await getPaymentConfig();

  const vodafoneCash =
    Array.isArray(newConfig.vodafoneCash) && newConfig.vodafoneCash.length > 0
      ? Array.from(new Set(newConfig.vodafoneCash.map((v) => String(v).trim()).filter(Boolean)))
      : current.vodafoneCash;

  const instapay =
    Array.isArray(newConfig.instapay) && newConfig.instapay.length > 0
      ? Array.from(new Set(newConfig.instapay.map((v) => String(v).trim()).filter(Boolean)))
      : current.instapay;

  const supportWhatsapp =
    typeof newConfig.supportWhatsapp === "string" && newConfig.supportWhatsapp.trim()
      ? newConfig.supportWhatsapp.trim()
      : current.supportWhatsapp;

  const supportEmail =
    typeof newConfig.supportEmail === "string" && newConfig.supportEmail.trim()
      ? newConfig.supportEmail.trim()
      : current.supportEmail;

  const activationHours =
    typeof newConfig.activationHours === "number" && newConfig.activationHours > 0
      ? newConfig.activationHours
      : current.activationHours;

  const updated: PaymentConfig = {
    vodafoneCash,
    instapay,
    supportWhatsapp,
    supportEmail,
    activationHours,
  };

  const jsonStr = JSON.stringify(updated);

  // 1. Persist to DB
  try {
    await ensureSettingTable();
    await prisma.$executeRaw`
      INSERT INTO SystemSetting (\`key\`, \`value\`, \`updatedAt\`)
      VALUES (${SETTING_KEY}, ${jsonStr}, NOW(3))
      ON DUPLICATE KEY UPDATE \`value\` = ${jsonStr}, \`updatedAt\` = NOW(3)
    `;
  } catch (err) {
    console.error("[payment-config] DB write failed:", err);
    // If DB fails, we still write to disk cache so local operations don't lose state
    saveDiskCache(updated);
    memoryCache = updated;
    memoryCacheTime = Date.now();
    throw new Error("فشل حفظ الإعدادات في قاعدة البيانات: " + (err instanceof Error ? err.message : String(err)));
  }

  // 2. Persist to Disk Cache & Memory
  saveDiskCache(updated);
  memoryCache = updated;
  memoryCacheTime = Date.now();

  return updated;
}

/**
 * Resets payment configuration to hardcoded brand defaults.
 */
export async function resetPaymentConfig(): Promise<PaymentConfig> {
  const defaults = getDefaultPaymentConfig();
  return updatePaymentConfig(defaults);
}
