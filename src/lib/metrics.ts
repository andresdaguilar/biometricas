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

function formatMetricValue(value: string | number | null | undefined): string | undefined {
  if (value === null || value === undefined || value === "") return undefined;
  const n = Number(value);
  return Number.isNaN(n) ? String(value) : String(n);
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
