import { getAllMeasurements } from "@/app/actions";
import MeasurementForm from "@/components/MeasurementForm";
import MeasurementsTable from "@/components/MeasurementsTable";
import { lastRecordedValues } from "@/lib/metrics";

export const dynamic = "force-dynamic";

export default async function RegistroPage() {
  const measurements = await getAllMeasurements();
  const lastValues = lastRecordedValues(measurements);

  return (
    <div className="space-y-8">
      <MeasurementForm lastValues={lastValues} />
      <div>
        <h2 className="mb-3 text-sm font-medium text-neutral-500">Últimos registros</h2>
        <MeasurementsTable measurements={measurements} />
      </div>
    </div>
  );
}
