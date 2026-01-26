"use client";

import { motion } from "framer-motion";
import { useAnimationContext } from "@/context/AnimationContext";

export function FloatingLogo() {
    const { triggerStickMan } = useAnimationContext();
    return (
        <div className="fixed right-4 md:right-8 top-[17vh] md:top-[25vh] z-50 pointer-events-auto cursor-pointer" onClick={triggerStickMan}>
            <motion.div
                animate={{
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0],
                }}
                transition={{
                    duration: 2,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatDelay: 8, // Total cycle 10s (2s animation + 8s delay)
                }}
                className="w-20 h-20 md:w-24 md:h-24 bg-[#D9F99D]"
                style={{
                    maskImage: 'url("/images/logo-floating.png")',
                    WebkitMaskImage: 'url("/images/logo-floating.png")',
                    maskSize: 'contain',
                    WebkitMaskSize: 'contain',
                    maskRepeat: 'no-repeat',
                    WebkitMaskRepeat: 'no-repeat',
                    maskPosition: 'right center',
                    WebkitMaskPosition: 'right center'
                }}
            />
        </div>
    );
}
