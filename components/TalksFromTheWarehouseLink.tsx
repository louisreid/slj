import {
  TALKS_FROM_THE_WAREHOUSE_LABEL,
  TALKS_FROM_THE_WAREHOUSE_URL,
} from "@/lib/site-branding";

export function TalksFromTheWarehouseLink({
  className = "",
  compact = false,
  onNavigate,
}: {
  className?: string;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <a
      href={TALKS_FROM_THE_WAREHOUSE_URL}
      onClick={onNavigate}
      className={`inline-flex items-center gap-2 font-sans text-sm text-[var(--slj-text-muted)] transition-colors hover:text-[var(--slj-text)] ${className}`}
    >
      <span aria-hidden className="text-base leading-none">
        ←
      </span>
      <span>{compact ? "TFW" : TALKS_FROM_THE_WAREHOUSE_LABEL}</span>
    </a>
  );
}
