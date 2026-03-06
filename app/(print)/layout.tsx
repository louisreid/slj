/**
 * Print route group: no app shell (no nav). Used for /worksheets/print/[id].
 */
export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
