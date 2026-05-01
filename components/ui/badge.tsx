import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-navy-50 text-navy-900",
        navy: "bg-navy text-white",
        aqua: "bg-aqua text-white",
        supplier: "bg-supplier text-white",
        success: "bg-success/10 text-success",
        warn: "bg-yellow-100 text-yellow-800",
        danger: "bg-danger/10 text-danger",
        outline: "border border-navy/20 text-navy-900",
        muted: "bg-gray-100 text-gray-700",
        pink: "bg-pink-100 text-pink-700",
        red: "bg-red-100 text-red-700",
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
