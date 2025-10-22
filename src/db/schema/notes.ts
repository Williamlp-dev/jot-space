
import { pgTable, varchar, uuid, text, timestamp, integer } from "drizzle-orm/pg-core";
import { user } from "./auth";

export const notesTable = pgTable("notes", {
  id: uuid().primaryKey().defaultRandom(),
  title: varchar({ length: 255 }).notNull(),
  description: text(),
  order: integer().notNull().default(0),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp().defaultNow().notNull(),
  updatedAt: timestamp().defaultNow().notNull(),
});

