export const METRICS = [
  { key: "peso", label: "Peso", unit: "kg" },
  { key: "grasaVisceral", label: "Grasa visceral", unit: "" },
  { key: "pctGrasa", label: "% Grasa", unit: "%" },
  { key: "pctMusculo", label: "% Músculo", unit: "%" },
  { key: "edadBiologica", label: "Edad biológica", unit: "años" },
  { key: "cinturaMedia", label: "Cintura media", unit: "cm" },
  { key: "cinturaAlta", label: "Cintura alta", unit: "cm" },
  { key: "bicepsIzq", label: "Bíceps izquierdo", unit: "cm" },
  { key: "bicepsDer", label: "Bíceps derecho", unit: "cm" },
] as const;

export type MetricKey = (typeof METRICS)[number]["key"];

export type MetricExtremes = Partial<Record<MetricKey, { min: number; max: number }>>;

export function formatMetricValue(value: string | number | null | undefined): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : String(n);
}

export function metricExtremes(
  rows: Array<Partial<Record<MetricKey, string | number | null>>>
): MetricExtremes {
  const result: MetricExtremes = {};
  for (const metric of METRICS) {
    let min: number | null = null;
    let max: number | null = null;
    for (const row of rows) {
      const formatted = formatMetricValue(row[metric.key]);
      if (formatted === undefined) continue;
      const value = Number(formatted);
      if (min === null || value < min) min = value;
      if (max === null || value > max) max = value;
    }
    if (min !== null && max !== null) result[metric.key] = { min, max };
  }
  return result;
}

export function extremeKind(
  value: string | number | null | undefined,
  extreme?: { min: number; max: number }
): "min" | "max" | null {
  if (!extreme) return null;
  const formatted = formatMetricValue(value);
  if (formatted === undefined) return null;
  const n = Number(formatted);
  if (extreme.min === extreme.max) return null;
  if (n === extreme.min) return "min";
  if (n === extreme.max) return "max";
  return null;
}

export function lastRecordedValues(
  rows: Array<Partial<Record<MetricKey, string | number | null>>>
): Partial<Record<MetricKey, string>> {
  const last: Partial<Record<MetricKey, string>> = {};
  for (const metric of METRICS) {
    const row = rows.find((r) => r[metric.key] != null && r[metric.key] !== "");
    const formatted = formatMetricValue(row?.[metric.key]);
    if (formatted !== undefined) last[metric.key] = formatted;
  }
  return last;
}
