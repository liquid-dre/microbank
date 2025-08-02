import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonBlock({
  rows = 3,
  width = '100%',
  height = '1.5rem',
}: {
  rows?: number
  width?: string
  height?: string
}) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton
          key={i}
          className="rounded-md bg-cream/60"
          style={{ width, height }}
        />
      ))}
    </div>
  )
}