"use server";

import { revalidatePath } from "next/cache";
import { connection } from "next/server";
import { z } from "zod";
import { getDb } from "@/db";
import { measurements } from "@/db/schema";

const numericField = z
  .union([z.string(), z.undefined(), z.null()])
  .transform((v) => (v === undefined || v === null || v.trim() === "" ? null : v));

const measurementSchema = z.object({
  fecha: z.string().min(1, "La fecha es obligatoria"),
  peso: numericField,
  grasaVisceral: numericField,
  pctGrasa: numericField,
  pctMusculo: numericField,
  edadBiologica: numericField,
  cinturaMedia: numericField,
  cinturaAlta: numericField,
  bicepsIzq: numericField,
  bicepsDer: numericField,
});

export type MeasurementFormState = {
  ok: boolean;
  error?: string;
};

export async function addMeasurement(
  _prev: MeasurementFormState,
  formData: FormData
): Promise<MeasurementFormState> {
  const raw = Object.fromEntries(formData.entries()) as Record<string, string>;
  const parsed = measurementSchema.safeParse(raw);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Datos inválidos" };
  }

  const { fecha, ...rest } = parsed.data;

  await getDb().insert(measurements).values({
    fecha: new Date(fecha),
    ...rest,
  });

  revalidatePath("/registro");
  revalidatePath("/graficos");
  revalidatePath("/stats");

  return { ok: true };
}

export async function deleteMeasurement(id: number) {
  const { eq } = await import("drizzle-orm");
  await getDb().delete(measurements).where(eq(measurements.id, id));
  revalidatePath("/registro");
  revalidatePath("/graficos");
  revalidatePath("/stats");
}

export async function getAllMeasurements() {
  await connection();
  const { desc } = await import("drizzle-orm");
  return getDb().select().from(measurements).orderBy(desc(measurements.fecha));
}
