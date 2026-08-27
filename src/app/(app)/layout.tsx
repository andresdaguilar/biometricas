import { ReactNode } from "react";
import NavTabs from "@/components/NavTabs";
import { logout } from "../logout-actions";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <header className="border-b border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
            Biométricas
          </h1>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-neutral-500 transition hover:text-neutral-800 dark:hover:text-neutral-200"
            >
              Cerrar sesión
            </button>
          </form>
        </div>
        <div className="mx-auto max-w-4xl px-4">
          <NavTabs />
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-6">{children}</main>
    </div>
  );
}
