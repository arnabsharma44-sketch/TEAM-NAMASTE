// components/ui/LoadingSkeleton.tsx
type Props = { rows?: number; height?: number };

export function LoadingSkeleton({ rows = 3, height = 100 }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="skeleton" style={{ height, borderRadius: 12 }} aria-hidden />
      ))}
    </div>
  );
}
