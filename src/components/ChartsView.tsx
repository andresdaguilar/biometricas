"use client";

import { useMemo, useState } from "react";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { METRICS, type MetricKey } from "@/lib/metrics";
import { clsx } from "@/lib/clsx";
import type { Measurement } from "@/db/schema";

const PERIODS = [
  { key: "7d", label: "1 semana", days: 7 },
  { key: "14d", label: "14 días", days: 14 },
  { key: "30d", label: "1 mes", days: 30 },
  { key: "90d", label: "3 meses", days: 90 },
  { key: "all", label: "Lifetime", days: null },
] as const;

type PeriodKey = (typeof PERIODS)[number]["key"];

function formatAxisDate(ts: number) {
  return new Intl.DateTimeFormat("es-AR", { day: "2-digit", month: "2-digit" }).format(
    new Date(ts)
  );
}

function formatTooltipDate(ts: number) {
  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(ts));
}

export default function ChartsView({ measurements }: { measurements: Measurement[] }) {
  const [period, setPeriod] = useState<PeriodKey>("30d");
  const [now] = useState(() => Date.now());

  const filtered = useMemo(() => {
    const periodDef = PERIODS.find((p) => p.key === period)!;
    const sorted = [...measurements].sort(
      (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
    );
    if (periodDef.days === null) return sorted;
    const cutoff = now - periodDef.days * 24 * 60 * 60 * 1000;
    return sorted.filter((m) => new Date(m.fecha).getTime() >= cutoff);
  }, [measurements, period, now]);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={clsx(
              "rounded-full px-3 py-1.5 text-sm font-medium transition",
              period === p.key
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-neutral-500">No hay datos para este período.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {METRICS.map((m) => (
            <MetricChart key={m.key} metricKey={m.key} label={m.label} unit={m.unit} data={filtered} />
          ))}
        </div>
      )}
    </div>
  );
}

function MetricChart({
  metricKey,
  label,
  unit,
  data,
}: {
  metricKey: MetricKey;
  label: string;
  unit: string;
  data: Measurement[];
}) {
  const points = data
    .map((row) => {
      const raw = row[metricKey];
      const value = raw === null || raw === undefined ? null : Number(raw);
      return { ts: new Date(row.fecha).getTime(), value };
    })
    .filter((p) => p.value !== null);

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
      <h3 className="mb-2 text-sm font-medium text-neutral-700 dark:text-neutral-300">
        {label} {unit && <span className="text-neutral-400">({unit})</span>}
      </h3>
      {points.length === 0 ? (
        <p className="py-10 text-center text-xs text-neutral-400">Sin datos</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={points} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-neutral-200 dark:stroke-neutral-800" />
            <XAxis
              dataKey="ts"
              type="number"
              domain={["dataMin", "dataMax"]}
              tickFormatter={formatAxisDate}
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              className="text-neutral-400"
            />
            <YAxis
              domain={["auto", "auto"]}
              tick={{ fontSize: 11 }}
              width={40}
              stroke="currentColor"
              className="text-neutral-400"
            />
            <Tooltip
              labelFormatter={(ts) => formatTooltipDate(Number(ts))}
              formatter={(value) => [value, label]}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#525252"
              strokeWidth={2}
              dot={{ r: 2 }}
              connectNulls
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
