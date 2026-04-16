import { u as normalizeE164 } from "../../utils-D5DtWkEu.js";
import { t as formatDocsLink } from "../../links-Dp5-Wbn2.js";
import { t as formatCliCommand } from "../../command-format-Dd3uP9-6.js";
import { r as buildChannelConfigSchema } from "../../config-schema-B6Z7tngN.js";
import { n as normalizeAccountId, t as DEFAULT_ACCOUNT_ID } from "../../account-id-j7GeQlaZ.js";
import { a as SignalConfigSchema } from "../../zod-schema.providers-core-ucwMwbqH.js";
import { a as chunkText } from "../../chunk-C8HOq7ak.js";
import { n as deleteAccountFromConfigSection, r as setAccountEnabledInConfigSection } from "../../config-helpers-BnrSrKhR.js";
import "../../text-runtime-BSu7DBcn.js";
import { n as formatPairingApproveHint } from "../../helpers-D33sU6YZ.js";
import { n as emptyPluginConfigSchema } from "../../config-schema-BJSXw2hl.js";
import { s as migrateBaseNameToDefaultAccount, t as applyAccountNameToChannelSection } from "../../setup-helpers-D2ui8Zu3.js";
import { o as getChatChannelMeta } from "../../core-D8GhZMD9.js";
import { t as createPluginRuntimeStore } from "../../runtime-store-Cvr8bl0h.js";
import { n as resolveAllowlistProviderRuntimeGroupPolicy, r as resolveDefaultGroupPolicy } from "../../runtime-group-policy-B7-UthCu.js";
import { t as resolveChannelMediaMaxBytes } from "../../media-limits-CdCXl04b.js";
import { t as PAIRING_APPROVED_MESSAGE } from "../../pairing-message-DXbuAoem.js";
import { c as collectStatusIssuesFromLastError, d as createDefaultChannelRuntimeState, n as buildBaseChannelStatusSummary, t as buildBaseAccountStatusSnapshot } from "../../status-helpers-BEDVo_4L.js";
import { t as detectBinary } from "../../detect-binary-EIuU3RzU.js";
import "../../setup-tools-ChX5E-WF.js";
import "../../config-runtime-B-XcrPKd.js";
import "../../reply-runtime-bgJu-e-Q.js";
import "../../media-runtime-C8DbMGvw.js";
import "../../channel-status-psq-AHLE.js";
import { i as resolveSignalAccount, n as listSignalAccountIds, r as resolveDefaultSignalAccountId, t as listEnabledSignalAccounts } from "../../accounts-fidmpxF4.js";
import { d as looksLikeSignalTargetId, f as normalizeSignalMessagingTarget } from "../../identity-BBBawC7P.js";
import { t as sendMessageSignal } from "../../send-DJO4NXZE.js";
import { n as sendReactionSignal, t as removeReactionSignal } from "../../reaction-runtime-api-nCnc0rCR.js";
import { n as resolveSignalReactionLevel, t as signalMessageActions } from "../../message-actions-DoH_KbpU.js";
import "../../config-api-BcOrQN3c.js";
import { n as installSignalCli } from "../../install-signal-cli-B5qJ3LA_.js";
import { t as monitorSignalProvider } from "../../monitor-CRWnExV7.js";
import { t as probeSignal } from "../../probe-DD8MPCpn.js";
//#region extensions/signal/src/runtime.ts
const { setRuntime: setSignalRuntime, clearRuntime: clearSignalRuntime, getRuntime: getSignalRuntime } = createPluginRuntimeStore({
	pluginId: "signal",
	errorMessage: "Signal runtime not initialized"
});
//#endregion
export { DEFAULT_ACCOUNT_ID, PAIRING_APPROVED_MESSAGE, SignalConfigSchema, applyAccountNameToChannelSection, buildBaseAccountStatusSnapshot, buildBaseChannelStatusSummary, buildChannelConfigSchema, chunkText, collectStatusIssuesFromLastError, createDefaultChannelRuntimeState, deleteAccountFromConfigSection, detectBinary, emptyPluginConfigSchema, formatCliCommand, formatDocsLink, formatPairingApproveHint, getChatChannelMeta, installSignalCli, listEnabledSignalAccounts, listSignalAccountIds, looksLikeSignalTargetId, migrateBaseNameToDefaultAccount, monitorSignalProvider, normalizeAccountId, normalizeE164, normalizeSignalMessagingTarget, probeSignal, removeReactionSignal, resolveAllowlistProviderRuntimeGroupPolicy, resolveChannelMediaMaxBytes, resolveDefaultGroupPolicy, resolveDefaultSignalAccountId, resolveSignalAccount, resolveSignalReactionLevel, sendMessageSignal, sendReactionSignal, setAccountEnabledInConfigSection, setSignalRuntime, signalMessageActions };
