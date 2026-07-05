import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  trend?: { direction: "up" | "down"; value: string };
  accent?: "navy" | "aqua" | "supplier" | "success" | "danger";
}

// 上部の色帯をやめ、数字の下に細いアクセント罫線を敷く編集的なスタイル
const ACCENT_RULE: Record<NonNullable<StatCardProps["accent"]>, string> = {
  navy: "bg-oni-blue",
  aqua: "bg-oni-blue",
  supplier: "bg-oni-red",
  success: "bg-oni-blue",
  danger: "bg-oni-red",
};

export function StatCard({
  label,
  value,
  hint,
  trend,
  accent = "navy",
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="!py-5">
        <p className="text-xs uppercase tracking-widest text-mist-500">
          {label}
        </p>
        <p className="num-emphasis mt-2 text-3xl font-bold text-ink">
          {value}
        </p>
        <div className={cn("mt-2 h-0.5 w-8", ACCENT_RULE[accent])} />
        {(hint || trend) && (
          <p className="mt-2 flex items-center gap-2 text-xs text-mist-500">
            {trend && (
              <span
                className={cn(
                  "font-semibold",
                  trend.direction === "up" ? "text-oni-blue" : "text-oni-red",
                )}
              >
                {trend.direction === "up" ? "+" : "-"}
                {trend.value.replace(/^[+-]/, "")}
              </span>
            )}
            {hint && <span>{hint}</span>}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
