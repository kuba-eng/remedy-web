import "./zod-schema.core-DvxunW4u.js";
import "./config-schema-B6Z7tngN.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-Bpxq-Zvh.js";
//#region src/plugin-sdk/twitch.ts
const twitchSetup = createOptionalChannelSetupSurface({
	channel: "twitch",
	label: "Twitch",
	npmSpec: "@openclaw/twitch"
});
const twitchSetupAdapter = twitchSetup.setupAdapter;
const twitchSetupWizard = twitchSetup.setupWizard;
//#endregion
export { twitchSetupWizard as n, twitchSetupAdapter as t };
