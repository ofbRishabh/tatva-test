import {
  int,
  json,
  mysqlTable,
  serial,
  timestamp,
  varchar,
  text,
  boolean,
  index,
  foreignKey,
  uniqueIndex,
} from "drizzle-orm/mysql-core";

export const usersTable = mysqlTable("users_table", {
  id: serial().primaryKey(),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

export const sites = mysqlTable("sites", {
  id: varchar("id", { length: 36 })
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }).notNull(),
  description: varchar("description", { length: 1024 }),
  subDomain: varchar("subDomain", { length: 255 }).unique().notNull(),
  settings: json("settings"),
  pages: json("pages"),
  customDomain: varchar("customDomain", { length: 255 }).unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pages = mysqlTable(
  "pages",
  {
    id: varchar("id", { length: 36 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    siteId: varchar("siteId", { length: 36 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    displayName: varchar("displayName", { length: 255 }),
    sortOrder: int("sortOrder").notNull().default(0),
    visible: boolean("visible").default(true),
    showInHeader: boolean("showInHeader").default(false),
    showInFooter: boolean("showInFooter").default(false),
    metaTitle: varchar("metaTitle", { length: 255 }),
    metaDescription: text("metaDescription"),
    // Store sections directly in the page as JSON
    sections: json("sections").$type<
      {
        id: string;
        type: string;
        content: any;
        sortOrder: number;
      }[]
    >(),
    createdAt: timestamp("createdAt").notNull().defaultNow(),
    updatedAt: timestamp("updatedAt")
      .notNull()
      .$onUpdate(() => new Date()),
  },
  (table) => {
    return {
      siteIdIdx: index("site_id_idx").on(table.siteId),
      slugIdx: index("slug_idx").on(table.slug),
      siteIdSlugUnique: uniqueIndex("site_id_slug_unique").on(
        table.siteId,
        table.slug
      ),
      siteIdFk: foreignKey({
        columns: [table.siteId],
        foreignColumns: [sites.id],
        name: "pages_site_id_fk",
      }),
    };
  }
);
