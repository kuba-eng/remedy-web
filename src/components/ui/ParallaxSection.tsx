"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ParallaxSectionProps {
    id?: string;
    bgImage: string;
    title: React.ReactNode;
    description: React.ReactNode;
    ctaText?: string;
    ctaLink?: string;
    secondaryCtaText?: string;
    secondaryCtaLink?: string;
    children?: React.ReactNode;
    className?: string;
    align?: "left" | "center" | "right";
}

export function ParallaxSection({
    id,
    bgImage,
    title,
    description,
    ctaText,
    ctaLink,
    secondaryCtaText,
    secondaryCtaLink,
    children,
    className,
    align = "center",
    titleClassName,
}: ParallaxSectionProps & { titleClassName?: string }) {
    return (
        <section
            id={id}
            className={cn(
                "relative w-full min-h-screen flex items-center bg-fixed bg-center bg-cover bg-no-repeat",
                className
            )}
            style={{ backgroundImage: `url('${bgImage}')` }}
        >
            {/* Dark Gradient Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80 pointer-events-none" />

            <div className={cn(
                "relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col gap-8",
                align === "center" && "items-center text-center",
                align === "left" && "items-start text-left",
                align === "right" && "items-end text-right"
            )}>
                <h2 className={cn(
                    "text-3xl md:text-4xl font-bold tracking-wide text-white uppercase drop-shadow-sm mb-4",
                    titleClassName
                )}>
                    {title}
                </h2>

                <p className="text-lg md:text-2xl text-neutral-200 font-light max-w-2xl leading-relaxed">
                    {description}
                </p>

                {(ctaText || secondaryCtaText) && (
                    <div className="flex flex-col sm:flex-row gap-4 mt-4">
                        {ctaText && (
                            <Button
                                variant="primary"
                                size="lg"
                                className="bg-white text-black hover:bg-[#D9F99D] hover:text-black border-none rounded-none px-12 h-14 font-semibold tracking-wide uppercase text-sm"
                                onClick={() => ctaLink && window.open(ctaLink, ctaLink.startsWith("#") ? "_self" : "_blank")}
                            >
                                {ctaText}
                            </Button>
                        )}

                        {secondaryCtaText && (
                            <Button
                                variant="outline"
                                size="lg"
                                className="border-white text-white hover:bg-[#D9F99D] hover:text-black hover:border-[#D9F99D] rounded-none px-10 h-14 font-semibold tracking-wide uppercase text-sm"
                                onClick={() => secondaryCtaLink && window.open(secondaryCtaLink, secondaryCtaLink.startsWith("#") ? "_self" : "_blank")}
                            >
                                {secondaryCtaText}
                            </Button>
                        )}
                    </div>
                )}

                {children && (
                    <div className="w-full mt-12 animate-in slide-in-from-bottom duration-1000 fade-in fill-mode-both">
                        {children}
                    </div>
                )}
            </div>
        </section>
    );
}
