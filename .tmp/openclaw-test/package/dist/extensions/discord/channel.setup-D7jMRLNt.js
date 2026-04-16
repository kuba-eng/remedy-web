import { r as discordSetupAdapter, t as createDiscordPluginBase } from "./shared-C9Le2uSl.js";
import { n as createDiscordSetupWizardProxy } from "./setup-core-D6YsAStu.js";
//#endregion
//#region extensions/discord/src/channel.setup.ts
const discordSetupPlugin = { ...createDiscordPluginBase({
	setupWizard: createDiscordSetupWizardProxy(async () => (await import("./setup-surface-BEMv6pdc.js")).discordSetupWizard),
	setup: discordSetupAdapter
}) };
//#endregion
export { discordSetupPlugin as t };
