import { r as buildChannelConfigSchema } from "../../config-schema-B6Z7tngN.js";
import { t as DEFAULT_ACCOUNT_ID } from "../../account-id-j7GeQlaZ.js";
import { r as IMessageConfigSchema } from "../../zod-schema.providers-core-ucwMwbqH.js";
import { m as formatTrimmedAllowFromEntries } from "../../channel-config-helpers-9F9ZxFrZ.js";
import { o as getChatChannelMeta } from "../../core-D8GhZMD9.js";
import { t as createPluginRuntimeStore } from "../../runtime-store-Cvr8bl0h.js";
import { t as resolveChannelMediaMaxBytes } from "../../media-limits-CdCXl04b.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DXbuAoem.js";
import { c as collectStatusIssuesFromLastError, r as buildComputedAccountStatusSnapshot } from "../../status-helpers-BEDVo_4L.js";
import "../../media-runtime-C8DbMGvw.js";
import { t as chunkTextForOutbound } from "../../text-chunking-CtENq2zv.js";
import "../../channel-status-psq-AHLE.js";
import { _ as resolveIMessageConfigAllowFrom, g as normalizeIMessageMessagingTarget, h as looksLikeIMessageTargetId, t as probeIMessage, v as resolveIMessageConfigDefaultTo } from "../../probe-DPBPz34F.js";
import { n as resolveIMessageGroupToolPolicy, t as resolveIMessageGroupRequireMention } from "../../group-policy-DeVawB-V.js";
import "../../config-api-1WPHbv3B.js";
import { n as sendMessageIMessage, t as monitorIMessageProvider } from "../../monitor-Cgo8_LRM.js";
//#region extensions/imessage/src/runtime.ts
const { setRuntime: setIMessageRuntime, getRuntime: getIMessageRuntime } = createPluginRuntimeStore({
	pluginId: "imessage",
	errorMessage: "iMessage runtime not initialized"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, IMessageConfigSchema, PAIRING_APPROVED_MESSAGE, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, chunkTextForOutbound, collectStatusIssuesFromLastError, formatTrimmedAllowFromEntries, getChatChannelMeta, looksLikeIMessageTargetId, monitorIMessageProvider, normalizeIMessageMessagingTarget, probeIMessage, resolveChannelMediaMaxBytes, resolveIMessageConfigAllowFrom, resolveIMessageConfigDefaultTo, resolveIMessageGroupRequireMention, resolveIMessageGroupToolPolicy, sendMessageIMessage, setIMessageRuntime };
