import { t as formatDocsLink } from "../links-Dp5-Wbn2.js";
import { r as buildChannelConfigSchema } from "../config-schema-B6Z7tngN.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../account-id-j7GeQlaZ.js";
import { t as createDedupeCache } from "../dedupe-uU1DnJKZ.js";
import { n as fetchWithSsrFGuard } from "../fetch-guard-B3p4gGaY.js";
import { c as isBlockedHostnameOrIp, t as SsrFBlockedError } from "../ssrf-DoOclwFS.js";
import { n as emptyPluginConfigSchema } from "../config-schema-BJSXw2hl.js";
import { l as patchScopedAccountConfig, t as applyAccountNameToChannelSection } from "../setup-helpers-D2ui8Zu3.js";
import { t as createChannelReplyPipeline } from "../channel-reply-pipeline-BPqhgZj2.js";
import { r as buildComputedAccountStatusSnapshot } from "../status-helpers-BEDVo_4L.js";
import { t as createLoggerBackedRuntime } from "../runtime-logger-CMNNz8AK.js";
import "../runtime-BwzKQAfC.js";
import { t as createOptionalChannelSetupSurface } from "../channel-setup-Bpxq-Zvh.js";
//#region src/plugin-sdk/tlon.ts
const tlonSetup = createOptionalChannelSetupSurface({
	channel: "tlon",
	label: "Tlon",
	npmSpec: "@openclaw/tlon",
	docsPath: "/channels/tlon"
});
const tlonSetupAdapter = tlonSetup.setupAdapter;
const tlonSetupWizard = tlonSetup.setupWizard;
//#endregion
export { DEFAULT_ACCOUNT_ID, SsrFBlockedError, applyAccountNameToChannelSection, buildChannelConfigSchema, buildComputedAccountStatusSnapshot, createChannelReplyPipeline, createDedupeCache, createLoggerBackedRuntime, emptyPluginConfigSchema, fetchWithSsrFGuard, formatDocsLink, isBlockedHostnameOrIp, normalizeAccountId, patchScopedAccountConfig, tlonSetupAdapter, tlonSetupWizard };
