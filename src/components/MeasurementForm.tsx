"use client";

import { useActionState, useEffect, useRef } from "react";
import { addMeasurement, MeasurementFormState } from "@/app/actions";
import { METRICS, type MetricKey } from "@/lib/metrics";

const initialState: MeasurementFormState = { ok: false };

function nowLocalDatetime() {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 16);
}

export default function MeasurementForm({
  lastValues = {},
}: {
  lastValues?: Partial<Record<MetricKey, string>>;
}) {
  const [state, formAction, pending] = useActionState(addMeasurement, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok) {
      formRef.current?.reset();
      const dateInput = formRef.current?.elements.namedItem("fecha") as HTMLInputElement | null;
      if (dateInput) dateInput.value = nowLocalDatetime();
    }
  }, [state.ok]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"
    >
      <div>
        <label htmlFor="fecha" className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Fecha y hora
        </label>
        <input
          id="fecha"
          name="fecha"
          type="datetime-local"
          defaultValue={nowLocalDatetime()}
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-800"
        />
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {METRICS.map((m) => (
          <div key={m.key}>
            <label
              htmlFor={m.key}
              className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300"
            >
              {m.label} {m.unit && <span className="text-neutral-400">({m.unit})</span>}
            </label>
            <input
              id={m.key}
              name={m.key}
              type="number"
              step="0.01"
              inputMode="decimal"
              placeholder={lastValues[m.key]}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:border-neutral-500 dark:border-neutral-700 dark:bg-neutral-800 dark:placeholder:text-neutral-500"
            />
          </div>
        ))}
      </div>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}
      {state.ok && (
        <p className="text-sm text-green-600" role="status">
          Registro guardado.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-700 disabled:opacity-60 sm:w-auto dark:bg-neutral-100 dark:text-neutral-900"
      >
        {pending ? "Guardando..." : "Guardar registro"}
      </button>
    </form>
  );
}
