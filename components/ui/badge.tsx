import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// モノクロ統一のバッジ。塗り強度と枠線で階層を表現。
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-mist-100 text-ink",
        navy: "bg-oni-blue text-paper",
        aqua: "bg-oni-blue-700 text-paper",
        supplier: "bg-oni-red text-paper",
        success: "bg-oni-blue-50 text-oni-blue-700 font-semibold",
        warn: "bg-fuku-sand-100 text-ink border border-fuku-sand-500",
        danger: "bg-paper text-oni-red border border-oni-red font-semibold",
        outline: "border border-mist-300 text-ink bg-paper",
        muted: "bg-mist-100 text-mist-500",
        pink: "bg-oni-blue-50 text-oni-blue-700",
        red: "bg-oni-red text-paper",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
