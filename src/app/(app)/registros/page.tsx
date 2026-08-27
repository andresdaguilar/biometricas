import Link from "next/link";
import { getAllMeasurements } from "@/app/actions";
import MeasurementsTable from "@/components/MeasurementsTable";
import { metricExtremes } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function RegistrosPage() {
  const measurements = await getAllMeasurements();
  const extremes = metricExtremes(measurements);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <Link
            href="/registro"
            className="text-sm text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
          >
            ← Registro
          </Link>
          <h2 className="mt-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Todos los registros
          </h2>
        </div>
        <p className="flex flex-wrap items-center gap-3 text-xs text-neutral-500">
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm bg-teal-500" />
            Mínimo
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="inline-block size-2.5 rounded-sm bg-orange-500" />
            Máximo
          </span>
        </p>
      </div>
      <MeasurementsTable measurements={measurements} extremes={extremes} />
    </div>
  );
}
