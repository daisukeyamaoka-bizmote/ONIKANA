import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: { direction: "up" | "down"; value: string };
  accent?: "navy" | "aqua" | "supplier" | "success" | "danger";
}

const ACCENT_BG: Record<NonNullable<StatCardProps["accent"]>, string> = {
  navy: "bg-navy",
  aqua: "bg-aqua",
  supplier: "bg-supplier",
  success: "bg-success",
  danger: "bg-danger",
};

export function StatCard({
  label,
  value,
  hint,
  trend,
  accent = "navy",
}: StatCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className={cn("h-1", ACCENT_BG[accent])} />
      <CardContent>
        <p className="text-sm font-medium text-navy-900/70">{label}</p>
        <p className="num-emphasis mt-2 text-3xl font-bold text-navy-900">
          {value}
        </p>
        {(hint || trend) && (
          <p className="mt-1 text-xs text-navy-900/60 flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "inline-flex items-center gap-0.5 font-semibold",
                  trend.direction === "up" ? "text-success" : "text-danger",
                )}
              >
                {trend.direction === "up" ? "▲" : "▼"} {trend.value}
              </span>
            )}
            {hint && <span>{hint}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
