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
