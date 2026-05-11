import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const rides = pgTable("rides", {
  id:           uuid("id").primaryKey().defaultRandom(),
  driverWallet: text("driver_wallet").notNull(),
  from:         text("from").notNull(),
  to:           text("to").notNull(),
  date:         text("date").notNull(),
  time:         text("time").notNull(),
  seats:        integer("seats").notNull().default(1),
  note:         text("note").default(""),
  createdAt:    timestamp("created_at").notNull().defaultNow(),
});

export type Ride    = typeof rides.$inferSelect;
export type NewRide = typeof rides.$inferInsert;

export const trips = pgTable("trips", {
  id:               uuid("id").primaryKey().defaultRandom(),
  passengerWallet:  text("passenger_wallet").notNull(),
  from:             text("from").notNull(),
  to:               text("to").notNull(),
  date:             text("date").notNull(),
  time:             text("time").notNull(),
  note:             text("note").default(""),
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export type Trip    = typeof trips.$inferSelect;
export type NewTrip = typeof trips.$inferInsert;
