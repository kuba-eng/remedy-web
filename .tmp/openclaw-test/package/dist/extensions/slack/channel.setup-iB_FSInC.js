import { i as createSlackPluginBase, n as slackSetupAdapter, t as slackSetupWizard } from "./setup-surface-pIjrXe3C.js";
//#region extensions/slack/src/channel.setup.ts
const slackSetupPlugin = { ...createSlackPluginBase({
	setupWizard: slackSetupWizard,
	setup: slackSetupAdapter
}) };
//#endregion
export { slackSetupPlugin as t };
