"use strict";
"use client";

import { useEffect, useState } from "react";
import { useAnimationContext } from "@/context/AnimationContext";

// -------------------------------------------------------------------------
// Analytical IK Solver (2 Joints)
// -------------------------------------------------------------------------
function solveIK(
    origin: { x: number; y: number },
    target: { x: number; y: number },
    L1: number,
    L2: number,
    flip: boolean = false
): { x: number; y: number } {
    const dx = target.x - origin.x;
    const dy = target.y - origin.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const d = Math.min(dist, L1 + L2 - 0.01);
    const baseAngle = Math.atan2(dy, dx);
    const cosAlpha = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d);
    const alpha = Math.acos(Math.max(-1, Math.min(1, cosAlpha)));

    // Joint Bend Direction
    const theta = flip ? baseAngle + alpha : baseAngle - alpha;
    return {
        x: origin.x + Math.cos(theta) * L1,
        y: origin.y + Math.sin(theta) * L1
    };
}

export function StickMan() {
    const { isStickManActive, finishStickMan } = useAnimationContext();
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        handleResize(); // Set initial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // -------------------------------------------------------------------------
    // Animation Config
    // -------------------------------------------------------------------------
    const DURATION = 20000;
    const THROW_TIME = 0.5;

    const [state, setState] = useState<{ p: number, dist: number }>({ p: 0, dist: 0 });

    useEffect(() => {
        if (!isStickManActive) return;

        const start = performance.now();
        let loopId: number;

        // MOVEMENT
        const startX = (windowWidth || 1000) + 100;
        const totalDist = (windowWidth || 1000) + 250;

        const loop = (now: number) => {
            const elapsed = now - start;
            const p = Math.min(1, elapsed / DURATION);

            let d = 0;
            const split = THROW_TIME;
            const splitDist = totalDist * 0.35;

            if (p < split) {
                d = (p / split) * splitDist;
            } else {
                const subP = (p - split) / (1 - split);
                const runDist = totalDist - splitDist;
                d = splitDist + (subP * subP * runDist);
            }

            setState({ p, dist: d });

            if (p < 1) {
                loopId = requestAnimationFrame(loop);
            } else {
                finishStickMan();
            }
        };

        loopId = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(loopId);
    }, [isStickManActive, DURATION, windowWidth, finishStickMan]);

    if (!isStickManActive) return null;

    const { p, dist } = state;
    const startX = (windowWidth || 1000) + 100;
    const xPos = startX - dist;

    // -------------------------------------------------------------------------
    // LOGIC
    // -------------------------------------------------------------------------

    // Cycle
    let phase = 0;
    const splitDist = ((windowWidth || 1000) + 250) * 0.35;

    if (dist < splitDist) {
        phase = (dist / 40) * Math.PI * 2;
    } else {
        const p1 = (splitDist / 40) * Math.PI * 2;
        phase = p1 + ((dist - splitDist) / 100) * Math.PI * 2;
    }

    // Blend - SMOOTH
    let crutchW = 0;
    let runW = 0;
    const BLEND_RANGE = 0.15;

    if (p < THROW_TIME - BLEND_RANGE) { crutchW = 1; runW = 0; }
    else if (p > THROW_TIME + BLEND_RANGE) { crutchW = 0; runW = 1; }
    else {
        const t = (p - (THROW_TIME - BLEND_RANGE)) / (BLEND_RANGE * 2);
        const smoothT = t * t * (3 - 2 * t);
        runW = smoothT;
        crutchW = 1 - smoothT;
    }

    // --- FEET ---
    const getFoot = (offset: number, stride: number, lift: number, isBadLeg: boolean) => {
        const cyc = (phase + offset) % (Math.PI * 2);
        let x = 0; let y = 0;

        if (cyc < Math.PI) { // Stance
            const t = cyc / Math.PI;
            x = (stride / 2) - (t * stride);
            y = 45;
        } else { // Swing
            const t = (cyc - Math.PI) / Math.PI;
            x = -(stride / 2) + (t * stride);
            const h = (isBadLeg && crutchW > 0.5) ? lift * 0.3 : lift;
            y = 45 - Math.sin(t * Math.PI) * h;
        }
        return { x, y };
    };

    const strideC = 35;
    const liftC = 15;
    const strideR = 100; const liftR = 40;

    const legL_posC = getFoot(Math.PI, strideC, liftC, false);
    const legL_posR = getFoot(Math.PI, strideR, liftR, false);

    const legR_posC = getFoot(0, strideC, liftC, true);
    const legR_posR = getFoot(0, strideR, liftR, true);

    const footL = { x: legL_posC.x * crutchW + legL_posR.x * runW, y: legL_posC.y * crutchW + legL_posR.y * runW };
    const footR = { x: legR_posC.x * crutchW + legR_posR.x * runW, y: legR_posC.y * crutchW + legR_posR.y * runW };

    // --- BODY ---
    const cyc = phase % (Math.PI * 2);
    let limpY = 0;
    if (cyc < Math.PI) {
        limpY = Math.sin(cyc) * 12;
    } else {
        limpY = -Math.sin(cyc - Math.PI) * 8;
    }

    const runY = -Math.abs(Math.sin(phase)) * 15;
    const bodyY = -60 + (limpY * crutchW + runY * runW);
    const hip = { x: 0, y: bodyY };

    // Hunch
    const hunch = 15 * crutchW + 5 * runW;
    const neckX = hip.x + hunch;
    const neckY = hip.y - 45 + (hunch * 0.1);
    const neck = { x: neckX, y: neckY };
    const head = { x: neckX + 6, y: neckY - 12 };

    // --- ARMS ---
    const armL = Math.sin(phase) * (20 * crutchW + 50 * runW);
    const handL = { x: neck.x + armL, y: neck.y + 25 };

    let handR;
    let crutch = null;
    const crutchLen = 65;

    if (p < THROW_TIME) {
        const reach = footR.x * 0.8;
        const rawHandX = neck.x + reach + 5;
        let rawHandY = neck.y + 25;
        const groundY = 45;
        const floorHandY = groundY - crutchLen;

        if (rawHandY > floorHandY) {
            rawHandY = floorHandY;
        }

        handR = { x: rawHandX, y: rawHandY };

        crutch = (
            <g transform={`translate(${handR.x}, ${handR.y}) rotate(10)`}>
                <path d="M -5 -5 Q 0 -10 5 -5" stroke="#444" strokeWidth="2" fill="none" />
                <line x1="0" y1="-5" x2="0" y2={crutchLen} stroke="#888" strokeWidth="3" />
                <line x1="0" y1={crutchLen} x2="0" y2={crutchLen + 3} stroke="#000" strokeWidth="5" />
                <line x1="0" y1="8" x2="8" y2="8" stroke="#444" strokeWidth="3" />
            </g>
        );
    } else {
        const armR = Math.sin(phase + Math.PI) * 50;
        handR = { x: neck.x + armR, y: neck.y + 25 };
    }

    // --- IK SOLVER ---
    const ARM = 20;
    const LEG_U = 24; const LEG_L = 24;

    const kneeL = solveIK(hip, { x: hip.x + footL.x, y: hip.y + footL.y }, LEG_U, LEG_L, false);
    const kneeR = solveIK(hip, { x: hip.x + footR.x, y: hip.y + footR.y }, LEG_U, LEG_L, false);

    const elbowL = solveIK({ x: neck.x, y: neck.y + 5 }, handL, ARM, ARM, true);
    const elbowR = solveIK({ x: neck.x, y: neck.y + 5 }, handR, ARM, ARM, true);

    const colorR = Math.floor(255 * crutchW + 217 * runW);
    const colorG = Math.floor(68 * crutchW + 249 * runW);
    const colorB = Math.floor(68 * crutchW + 157 * runW);
    const color = `rgb(${colorR}, ${colorG}, ${colorB})`;

    return (
        <div
            className="fixed bottom-0 z-50 pointer-events-none"
            style={{
                left: xPos,
                width: '100px',
                height: '130px',
                transform: 'scaleX(-1)' // Walking "Left"
            }}
        >
            <svg width="100%" height="100%" viewBox="-60 -120 120 160" overflow="visible">
                <g strokeLinecap="round" strokeLinejoin="round" fill="none">
                    <g stroke={color} strokeWidth="2.5" opacity="0.6">
                        <path d={`M ${neck.x} ${neck.y + 5} L ${elbowR.x} ${elbowR.y} L ${handR.x} ${handR.y}`} />
                        {crutch}
                        <path d={`M ${hip.x} ${hip.y} L ${kneeR.x} ${kneeR.y} L ${hip.x + footR.x} ${hip.y + footR.y}`} />
                    </g>

                    <path d={`M ${hip.x} ${hip.y} Q ${hip.x - hunch * 0.3} ${hip.y - 30} ${neck.x} ${neck.y}`} stroke={color} strokeWidth="5" />
                    <circle cx={head.x} cy={head.y} r="9" stroke={color} strokeWidth="3" fill="none" />

                    <g stroke={color} strokeWidth="4">
                        <path d={`M ${neck.x} ${neck.y + 5} L ${elbowL.x} ${elbowL.y} L ${handL.x} ${handL.y}`} />
                        <path d={`M ${hip.x} ${hip.y} L ${kneeL.x} ${kneeL.y} L ${hip.x + footL.x} ${hip.y + footL.y}`} />
                    </g>
                </g>
            </svg>
        </div>
    );
}
