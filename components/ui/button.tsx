import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// モノクロ統一のボタン。色の代わりに塗り/枠線/太さで階層を表現します。
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        // 第一階層: 黒で塗ったボタン
        primary: "bg-ink text-paper hover:bg-mist-800 shadow-card",
        // セカンダリも黒系で統一(過去のaquaを置き換え)
        secondary: "bg-mist-700 text-paper hover:bg-ink shadow-card",
        // 支援先専用色も黒に統一
        supplier: "bg-ink text-paper hover:bg-mist-800 shadow-card",
        // 成功系は太字+黒
        success: "bg-ink text-paper hover:bg-mist-800 font-semibold shadow-card",
        // 危険操作はアウトライン+太字で表現
        danger:
          "bg-paper text-ink border border-ink hover:bg-mist-100 font-semibold",
        outline:
          "border border-mist-300 bg-paper text-ink hover:bg-mist-100",
        ghost: "text-ink hover:bg-mist-100",
        // 「気になる」: 通常は枠線、選択時はグレー塗り
        like: "bg-mist-200 text-ink border border-ink/0 font-semibold",
        likeIdle:
          "bg-paper border border-mist-300 text-ink hover:bg-mist-50 hover:border-mist-400",
        // 「ぜひ話したい」: 選択時は黒塗り
        superLike:
          "bg-ink text-paper border border-ink font-semibold",
        superLikeIdle:
          "bg-paper border border-mist-300 text-ink hover:bg-mist-50 hover:border-ink",
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
