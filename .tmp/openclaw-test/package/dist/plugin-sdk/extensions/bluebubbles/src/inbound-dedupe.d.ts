import type { NormalizedWebhookMessage } from "./monitor-normalize.js";
/**
 * Resolve the canonical dedupe key for a BlueBubbles inbound message.
 *
 * Mirrors `monitor-debounce.ts`'s `buildKey`: BlueBubbles sends URL-preview
 * / sticker "balloon" events with a different `messageId` than the text
 * message they belong to, and the debouncer coalesces the two only when
 * both `balloonBundleId` AND `associatedMessageGuid` are present. We gate
 * on the same pair so that regular replies — which also set
 * `associatedMessageGuid` (pointing at the parent message) but have no
 * `balloonBundleId` — are NOT collapsed onto their parent's dedupe key.
 *
 * Known tradeoff: `combineDebounceEntries` clears `balloonBundleId` on
 * merged entries while keeping `associatedMessageGuid`, so a post-merge
 * balloon+text message here will fall back to its `messageId`. A later
 * MessagePoller replay that arrives in a different text-first/balloon-first
 * order could therefore produce a different `messageId` at merge time and
 * bypass this dedupe for that one message. That edge case is strictly
 * narrower than the alternative — which would dedupe every distinct user
 * reply against the same parent GUID and silently drop real messages.
 */
export declare function resolveBlueBubblesInboundDedupeKey(message: Pick<NormalizedWebhookMessage, "messageId" | "balloonBundleId" | "associatedMessageGuid">): string | undefined;
export type InboundDedupeClaim = {
    kind: "claimed";
    finalize: () => Promise<void>;
    release: () => void;
} | {
    kind: "duplicate";
} | {
    kind: "inflight";
} | {
    kind: "skip";
};
/**
 * Attempt to claim an inbound BlueBubbles message GUID.
 *
 * - `claimed`: caller should process the message, then call `finalize()` on
 *   success (persists the GUID) or `release()` on failure (lets a later
 *   replay try again).
 * - `duplicate`: we've already committed this GUID; caller should drop.
 * - `inflight`: another claim is currently in progress; caller should drop
 *   rather than race.
 * - `skip`: GUID was missing or invalid — caller should continue processing
 *   without dedup (no finalize/release needed).
 */
export declare function claimBlueBubblesInboundMessage(params: {
    guid: string | undefined | null;
    accountId: string;
    onDiskError?: (error: unknown) => void;
}): Promise<InboundDedupeClaim>;
/**
 * Reset inbound dedupe state between tests. Installs an in-memory-only
 * implementation so tests do not hit disk, avoiding file-lock timing issues
 * in the webhook flush path.
 */
export declare function _resetBlueBubblesInboundDedupForTest(): void;
