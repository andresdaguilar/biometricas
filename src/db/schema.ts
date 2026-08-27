import { pgTable, serial, timestamp, numeric } from "drizzle-orm/pg-core";

export const measurements = pgTable("measurements", {
  id: serial("id").primaryKey(),
  fecha: timestamp("fecha", { withTimezone: true }).notNull(),
  peso: numeric("peso", { precision: 5, scale: 2 }),
  grasaVisceral: numeric("grasa_visceral", { precision: 5, scale: 2 }),
  pctGrasa: numeric("pct_grasa", { precision: 5, scale: 2 }),
  pctMusculo: numeric("pct_musculo", { precision: 5, scale: 2 }),
  edadBiologica: numeric("edad_biologica", { precision: 5, scale: 2 }),
  cinturaMedia: numeric("cintura_media", { precision: 5, scale: 2 }),
  cinturaAlta: numeric("cintura_alta", { precision: 5, scale: 2 }),
  bicepsIzq: numeric("biceps_izq", { precision: 5, scale: 2 }),
  bicepsDer: numeric("biceps_der", { precision: 5, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Measurement = typeof measurements.$inferSelect;
export type NewMeasurement = typeof measurements.$inferInsert;
