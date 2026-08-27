"use client";

import { useTransition } from "react";
import { deleteMeasurement } from "@/app/actions";
import { METRICS } from "@/lib/metrics";
import type { Measurement } from "@/db/schema";

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export default function MeasurementsTable({ measurements }: { measurements: Measurement[] }) {
  const [isPending, startTransition] = useTransition();

  if (measurements.length === 0) {
    return <p className="text-sm text-neutral-500">Todavía no hay registros.</p>;
  }

  return (
    <div className="overflow-x-auto rounded-2xl border border-neutral-200 dark:border-neutral-800">
      <table className="w-full min-w-[900px] text-left text-sm">
        <thead className="bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
          <tr>
            <th className="px-3 py-2 font-medium">Fecha</th>
            {METRICS.map((m) => (
              <th key={m.key} className="px-3 py-2 font-medium whitespace-nowrap">
                {m.label}
              </th>
            ))}
            <th className="px-3 py-2 font-medium" />
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
          {measurements.map((row) => (
            <tr key={row.id}>
              <td className="whitespace-nowrap px-3 py-2 text-neutral-700 dark:text-neutral-300">
                {formatDate(new Date(row.fecha))}
              </td>
              {METRICS.map((m) => (
                <td key={m.key} className="px-3 py-2 text-neutral-700 dark:text-neutral-300">
                  {row[m.key] ?? "—"}
                </td>
              ))}
              <td className="px-3 py-2">
                <button
                  disabled={isPending}
                  onClick={() => startTransition(() => deleteMeasurement(row.id))}
                  className="text-xs text-red-500 hover:text-red-700 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
