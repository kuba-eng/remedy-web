"use strict";
"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

interface AnimationContextType {
    isStickManActive: boolean;
    triggerStickMan: () => void;
    finishStickMan: () => void;
}

const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

export function AnimationProvider({ children }: { children: ReactNode }) {
    const [isStickManActive, setStickManActive] = useState(false);

    const triggerStickMan = useCallback(() => {
        if (!isStickManActive) {
            setStickManActive(true);
        }
    }, [isStickManActive]);

    const finishStickMan = useCallback(() => {
        setStickManActive(false);
    }, []);

    return (
        <AnimationContext.Provider value={{ isStickManActive, triggerStickMan, finishStickMan }}>
            {children}
        </AnimationContext.Provider>
    );
}

export function useAnimationContext() {
    const context = useContext(AnimationContext);
    if (context === undefined) {
        throw new Error("useAnimationContext must be used within an AnimationProvider");
    }
    return context;
}
