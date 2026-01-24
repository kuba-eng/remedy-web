import * as React from "react";

import { cn } from "@/lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg";
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", fullWidth, ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 duration-200",
                    // Variants
                    variant === "primary" && "bg-primary text-primary-foreground hover:bg-[#D9F99D] hover:text-black shadow-md",
                    variant === "secondary" && "bg-muted text-muted-foreground hover:bg-[#D9F99D] hover:text-black",
                    variant === "outline" && "border-2 border-primary text-primary hover:bg-[#D9F99D] hover:text-black hover:border-[#D9F99D]",
                    variant === "ghost" && "text-foreground hover:bg-muted/50",
                    // Sizes
                    size === "sm" && "h-9 px-4 text-sm",
                    size === "md" && "h-11 px-8 text-base",
                    size === "lg" && "h-14 px-10 text-lg",
                    fullWidth && "w-full",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
