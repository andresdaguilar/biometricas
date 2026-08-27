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

export default async function StatsPage() {
  const measurements = await getAllMeasurements();

  if (measurements.length === 0) {
    return <p className="text-sm text-neutral-500">Todavía no hay registros.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[600px] text-left text-sm">
        <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          <tr>
            <th className="px-3 py-2 font-medium">Métrica</th>
            <th className="px-3 py-2 font-medium">Mínimo</th>
            <th className="px-3 py-2 font-medium">Fecha mínimo</th>
            <th className="px-3 py-2 font-medium">Máximo</th>
            <th className="px-3 py-2 font-medium">Fecha máximo</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {METRICS.map((m) => {
            const { min, max } = computeMinMax(measurements, m.key);
            return (
              <tr key={m.key}>
                <td className="px-3 py-2 font-medium text-neutral-700 dark:text-neutral-300">
                  {m.label} {m.unit && <span className="text-neutral-400">({m.unit})</span>}
                </td>
                <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                  {min ? min.value : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-neutral-500">
                  {min ? formatDate(min.fecha) : "—"}
                </td>
                <td className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                  {max ? max.value : "—"}
                </td>
                <td className="px-3 py-2 whitespace-nowrap text-neutral-500">
                  {max ? formatDate(max.fecha) : "—"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
