import { PrismaClient } from "@prisma/client";

/**
 * =============================================================================
 * NASA SPACE CHALLENGE - PRISMA CLIENT SINGLETON
 * =============================================================================
 * Mantiene una única instancia activa del cliente Prisma durante el ciclo de vida
 * del servidor de Next.js (evitando el agotamiento de conexiones en desarrollo por HMR).
 * 
 * Conexión optimizada para PostgreSQL / Supabase Connection Pooler (PgBouncer).
 */

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
