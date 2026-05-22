import { PrismaClient } from "@/app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL!;

  // Parse the URL so the WHATWG URL API properly decodes percent-encoded
  // characters in the password (e.g. %25%2F → %/ ).
  // Then pass individual params to pg.Pool — no further decoding needed.
  const url = new URL(connectionString);

  const pool = new Pool({
    host: url.hostname,
    port: Number(url.port) || 5432,
    user: url.username,       // WHATWG URL API already decoded this
    password: url.password,   // WHATWG URL API already decoded this (e.g. %25%2F → %/)
    database: url.pathname.replace(/^\//, "").split("?")[0],
    ssl: { rejectUnauthorized: false },
    max: 3,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  });

  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
