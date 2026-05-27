import type { ReactNode } from "react";

export function Row({ title, children, action }: { title: string; children: ReactNode; action?: ReactNode }) {
  return (
    <section className="mt-7">
      <div className="flex items-center justify-between px-4 mb-3">
        <h2 className="text-lg font-bold text-white">{title}</h2>
        {action}
      </div>
      <div className="flex gap-3 overflow-x-auto no-scrollbar px-4 pb-1">
        {children}
      </div>
    </section>
  );
}
