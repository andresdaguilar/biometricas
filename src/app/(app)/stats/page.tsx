import { getAllMeasurements } from "@/app/actions";
import { METRICS } from "@/lib/metrics";
import type { Measurement } from "@/db/schema";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(d);
}

function formatValue(value: number) {
  return String(value);
}

function computeMinMax(measurements: Measurement[], key: (typeof METRICS)[number]["key"]) {
  let min: { value: number; fecha: Date } | null = null;
  let max: { value: number; fecha: Date } | null = null;

  for (const row of measurements) {
    const raw = row[key];
    if (raw === null || raw === undefined) continue;
    const value = Number(raw);
    const fecha = new Date(row.fecha);
    if (min === null || value < min.value) min = { value, fecha };
    if (max === null || value > max.value) max = { value, fecha };
  }

  return { min, max };
}

function StatSide({
  label,
  value,
  fecha,
}: {
  label: string;
  value: number | null;
  fecha: Date | null;
}) {
  return (
    <div className="min-w-0">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-0.5 text-lg font-semibold tabular-nums text-neutral-900 dark:text-neutral-100">
        {value !== null ? formatValue(value) : "—"}
      </p>
      <p className="truncate text-xs text-neutral-500">{fecha ? formatDate(fecha) : "—"}</p>
    </div>
  );
}

export default async function StatsPage() {
  const measurements = await getAllMeasurements();

  if (measurements.length === 0) {
    return <p className="text-sm text-neutral-500">Todavía no hay registros.</p>;
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {METRICS.map((m) => {
        const { min, max } = computeMinMax(measurements, m.key);
        return (
          <li
            key={m.key}
            className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
          >
            <h2 className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              {m.label}
              {m.unit ? <span className="ml-1 font-normal text-neutral-400">({m.unit})</span> : null}
            </h2>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <StatSide
                label="Mínimo"
                value={min ? min.value : null}
                fecha={min ? min.fecha : null}
              />
              <StatSide
                label="Máximo"
                value={max ? max.value : null}
                fecha={max ? max.fecha : null}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
