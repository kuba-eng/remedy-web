import { a as resolveSlackAccount, c as resolveSlackBotToken, i as resolveDefaultSlackAccountId, n as listSlackAccountIds, r as mergeSlackAccountConfig, s as resolveSlackAppToken, t as listEnabledSlackAccounts } from "./accounts-DVaYcDJy.js";
import { a as resolveSlackGroupToolPolicy, i as resolveSlackGroupRequireMention, r as setSlackRuntime } from "./runtime-BbipK06_.js";
import { t as resolveSlackChannelAllowlist } from "./resolve-channels-OJAQ6Fou.js";
import { t as resolveSlackUserAllowlist } from "./resolve-users-BDK6Fzjs.js";
import { t as sendMessageSlack } from "./send-BIelMKQI.js";
import { a as listSlackEmojis, c as pinSlackMessage, d as removeOwnSlackReactions, f as removeSlackReaction, i as getSlackMemberInfo, l as reactSlackMessage, m as unpinSlackMessage, o as listSlackPins, p as sendSlackMessage, r as editSlackMessage, s as listSlackReactions, t as deleteSlackMessage, u as readSlackMessages } from "./actions-CEQk9ddI.js";
import { r as normalizeSlackWebhookPath } from "./registry-DBIJgpFS.js";
import { t as probeSlack } from "./probe-BIjJHAwd.js";
import { t as monitorSlackProvider } from "./provider-C5qmMP14.js";
import { n as slackActionRuntime, t as handleSlackAction } from "./action-runtime-CLXjPKfO.js";
import { n as listSlackDirectoryGroupsLive, r as listSlackDirectoryPeersLive } from "./directory-live-Df8CMZOr.js";
import "./monitor-QvKJ41ka.js";
import { DEFAULT_ACCOUNT_ID } from "openclaw/plugin-sdk/account-id";
//#region extensions/slack/src/http/plugin-routes.ts
let slackHttpHandlerRuntimePromise = null;
async function loadSlackHttpHandlerRuntime() {
	slackHttpHandlerRuntimePromise ??= import("./handler.runtime-D4dvWqQe.js");
	return await slackHttpHandlerRuntimePromise;
}
function registerSlackPluginHttpRoutes(api) {
	const accountIds = new Set([DEFAULT_ACCOUNT_ID, ...listSlackAccountIds(api.config)]);
	const registeredPaths = /* @__PURE__ */ new Set();
	for (const accountId of accountIds) {
		const accountConfig = mergeSlackAccountConfig(api.config, accountId);
		registeredPaths.add(normalizeSlackWebhookPath(accountConfig.webhookPath));
	}
	if (registeredPaths.size === 0) registeredPaths.add(normalizeSlackWebhookPath());
	for (const path of registeredPaths) api.registerHttpRoute({
		path,
		auth: "plugin",
		handler: async (req, res) => await (await loadSlackHttpHandlerRuntime()).handleSlackHttpRequest(req, res)
	});
}
//#endregion
export { deleteSlackMessage, editSlackMessage, getSlackMemberInfo, handleSlackAction, listEnabledSlackAccounts, listSlackAccountIds, listSlackDirectoryGroupsLive, listSlackDirectoryPeersLive, listSlackEmojis, listSlackPins, listSlackReactions, monitorSlackProvider, pinSlackMessage, probeSlack, reactSlackMessage, readSlackMessages, registerSlackPluginHttpRoutes, removeOwnSlackReactions, removeSlackReaction, resolveDefaultSlackAccountId, resolveSlackAccount, resolveSlackAppToken, resolveSlackBotToken, resolveSlackChannelAllowlist, resolveSlackGroupRequireMention, resolveSlackGroupToolPolicy, resolveSlackUserAllowlist, sendMessageSlack, sendSlackMessage, setSlackRuntime, slackActionRuntime, unpinSlackMessage };
