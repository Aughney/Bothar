import { pgTable, text, integer, timestamp, uuid } from "drizzle-orm/pg-core";

export const rides = pgTable("rides", {
  id:           uuid("id").primaryKey().defaultRandom(),
  driverWallet: text("driver_wallet").notNull(),
  driverEmail:  text("driver_email").default(""),
  driverName:   text("driver_name").default(""),
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

export const seatRequests = pgTable("seat_requests", {
  id:               uuid("id").primaryKey().defaultRandom(),
  rideId:           uuid("ride_id").notNull().references(() => rides.id, { onDelete: "cascade" }),
  passengerWallet:  text("passenger_wallet").notNull(),
  passengerEmail:   text("passenger_email").default(""),
  message:          text("message").default(""),
  status:           text("status").notNull().default("pending"), // pending | accepted | declined | completed | disputed
  createdAt:        timestamp("created_at").notNull().defaultNow(),
});

export type SeatRequest    = typeof seatRequests.$inferSelect;
export type NewSeatRequest = typeof seatRequests.$inferInsert;
