import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// モノクロ統一のボタン。色の代わりに塗り/枠線/太さで階層を表現します。
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // 第一階層: 群青塗り(Primary action)
        primary: "bg-oni-blue text-paper hover:bg-oni-blue-700 shadow-card",
        // セカンダリ: 群青の中間
        secondary: "bg-aqua text-paper hover:bg-oni-blue shadow-card",
        // 支援先(Giver)アイデンティティ: 朱塗り
        supplier: "bg-oni-red text-paper hover:bg-oni-red-700 shadow-card",
        // 成功(完了・承諾):群青
        success: "bg-oni-blue text-paper hover:bg-oni-blue-700 font-semibold shadow-card",
        // 危険操作:朱の枠線(色は使う、面積は最小に)
        danger:
          "bg-paper text-oni-red border border-oni-red hover:bg-oni-red-50 font-semibold",
        outline:
          "border border-mist-300 bg-paper text-ink hover:bg-mist-100",
        ghost: "text-ink hover:bg-mist-100",
        // 気になる(興味のシグナル): 群青のサブトル
        like: "bg-oni-blue-50 text-oni-blue-700 border border-oni-blue font-semibold",
        likeIdle:
          "bg-paper border border-mist-300 text-ink hover:bg-oni-blue-50 hover:border-oni-blue-200",
        // ぜひ話したい(熱意のシグナル): 朱の塗り
        superLike:
          "bg-oni-red text-paper border border-oni-red font-semibold",
        superLikeIdle:
          "bg-paper border border-mist-300 text-ink hover:bg-oni-red-50 hover:border-oni-red-200",
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        xl: "h-14 px-8 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";
