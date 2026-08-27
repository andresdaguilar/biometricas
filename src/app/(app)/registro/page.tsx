import Link from "next/link";
import { getAllMeasurements } from "@/app/actions";
import MeasurementForm from "@/components/MeasurementForm";
import MeasurementsTable from "@/components/MeasurementsTable";
import { lastRecordedValues } from "@/lib/metrics";

export const dynamic = "force-dynamic";

const PREVIEW_COUNT = 10;

export default async function RegistroPage() {
  const measurements = await getAllMeasurements();
  const lastValues = lastRecordedValues(measurements);
  const preview = measurements.slice(0, PREVIEW_COUNT);

  return (
    <div className="space-y-8">
      <MeasurementForm lastValues={lastValues} />
      <div>
        <div className="mb-3 flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-medium text-neutral-500">Últimos registros</h2>
          {measurements.length > PREVIEW_COUNT && (
            <Link
              href="/registros"
              className="text-sm font-medium text-teal-700 hover:text-teal-900 dark:text-teal-400 dark:hover:text-teal-200"
            >
              Ver más
            </Link>
          )}
        </div>
        <MeasurementsTable measurements={preview} />
      </div>
    </div>
  );
}
