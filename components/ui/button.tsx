import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        primary: "bg-navy text-white hover:bg-navy-700 shadow-card",
        secondary: "bg-aqua text-white hover:bg-aqua-700 shadow-card",
        supplier: "bg-supplier text-white hover:bg-supplier-700 shadow-card",
        success: "bg-success text-white hover:bg-success/90 shadow-card",
        danger: "bg-danger text-white hover:bg-danger/90 shadow-card",
        outline:
          "border border-navy/20 bg-white text-navy hover:bg-navy-50",
        ghost: "text-navy hover:bg-navy-50",
        like: "bg-pink-500 text-white hover:bg-pink-600 shadow-card",
        likeIdle:
          "bg-white border border-navy-200 text-navy-900 hover:bg-pink-50 hover:border-pink-300",
        superLike: "bg-red-600 text-white hover:bg-red-700 shadow-card",
        superLikeIdle:
          "bg-white border border-navy-200 text-navy-900 hover:bg-red-50 hover:border-red-300",
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
