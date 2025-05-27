import mysql from "mysql2/promise";
import { drizzle, MySql2Database } from "drizzle-orm/mysql2";
import * as schema from "./schema";
import "dotenv/config"; // Add this if running in scripts

const pool = mysql.createPool(process.env.DATABASE_URL!);

const db: MySql2Database<typeof schema> = drizzle(pool, {
  schema,
  mode: "default",
  logger: true,
});

export default db;
export type DrizzleClient = typeof db;
