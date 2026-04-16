import { processMessage } from "./monitor-processing.js";
import type { WebhookTarget } from "./monitor-shared.js";
export type BlueBubblesCatchupConfig = {
    enabled?: boolean;
    maxAgeMinutes?: number;
    perRunLimit?: number;
    firstRunLookbackMinutes?: number;
};
export type BlueBubblesCatchupSummary = {
    querySucceeded: boolean;
    replayed: number;
    skippedFromMe: number;
    skippedPreCursor: number;
    failed: number;
    cursorBefore: number | null;
    cursorAfter: number;
    windowStartMs: number;
    windowEndMs: number;
    fetchedCount: number;
};
export type BlueBubblesCatchupCursor = {
    lastSeenMs: number;
    updatedAt: number;
};
export declare function loadBlueBubblesCatchupCursor(accountId: string): Promise<BlueBubblesCatchupCursor | null>;
export declare function saveBlueBubblesCatchupCursor(accountId: string, lastSeenMs: number): Promise<void>;
type FetchOpts = {
    baseUrl: string;
    password: string;
    allowPrivateNetwork: boolean;
    timeoutMs?: number;
};
export type BlueBubblesCatchupFetchResult = {
    resolved: boolean;
    messages: Array<Record<string, unknown>>;
};
export declare function fetchBlueBubblesMessagesSince(sinceMs: number, limit: number, opts: FetchOpts): Promise<BlueBubblesCatchupFetchResult>;
export type RunBlueBubblesCatchupDeps = {
    fetchMessages?: typeof fetchBlueBubblesMessagesSince;
    processMessageFn?: typeof processMessage;
    now?: () => number;
    log?: (message: string) => void;
    error?: (message: string) => void;
};
export declare function runBlueBubblesCatchup(target: WebhookTarget, deps?: RunBlueBubblesCatchupDeps): Promise<BlueBubblesCatchupSummary | null>;
export {};
