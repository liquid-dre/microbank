import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonBlock({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-6 w-full rounded-md bg-cream/60" />
      ))}
    </div>
  )
}