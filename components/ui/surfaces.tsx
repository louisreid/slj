import type { PropsWithChildren, ReactNode } from "react";

export function PageShell({
  children,
  className = "",
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={`font-sans slj-shell p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
}

export function CardSection({
  title,
  children,
  className = "",
}: PropsWithChildren<{ title?: ReactNode; className?: string }>) {
  return (
    <section className={`slj-card p-5 ${className}`}>
      {title ? (
        <h2 className="mb-3 font-sans text-lg font-medium text-black">{title}</h2>
      ) : null}
      {children}
    </section>
  );
}
