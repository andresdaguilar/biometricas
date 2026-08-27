import { getAllMeasurements } from "@/app/actions";
import ChartsView from "@/components/ChartsView";

export const dynamic = "force-dynamic";

export default async function GraficosPage() {
  const measurements = await getAllMeasurements();
  return <ChartsView measurements={measurements} />;
}
