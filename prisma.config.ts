import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrate: {
    url: process.env.DATABASE_URL!,
  },
});