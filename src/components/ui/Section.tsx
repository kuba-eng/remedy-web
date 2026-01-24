import { cn } from "@/lib/utils";

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    id?: string;
    className?: string;
    children: React.ReactNode;
    containerClassName?: string;
}

export function Section({ id, className, children, containerClassName, ...props }: SectionProps) {
    return (
        <section
            id={id}
            className={cn("py-20 md:py-28 px-4 w-full", className)}
            {...props}
        >
            <div className={cn("max-w-7xl mx-auto", containerClassName)}>
                {children}
            </div>
        </section>
    );
}
