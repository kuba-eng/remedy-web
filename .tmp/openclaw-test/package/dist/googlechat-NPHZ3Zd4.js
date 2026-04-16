import "./types.secrets-CeL3gSMO.js";
import "./config-schema-B6Z7tngN.js";
import "./registry-CENZffQG.js";
import "./zod-schema.providers-core-ucwMwbqH.js";
import "./fetch-guard-B3p4gGaY.js";
import "./common-BWtun2If.js";
import "./fetch-BL7ekE3E.js";
import { n as resolveChannelGroupRequireMention } from "./group-policy-BtMLH9Qc.js";
import "./setup-helpers-D2ui8Zu3.js";
import "./channel-policy-Du0WjQuj.js";
import "./dm-policy-shared-B8t-T2Dt.js";
import "./setup-wizard-helpers-DPfZaq_K.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import "./channel-pairing-DTvM6AVp.js";
import "./status-helpers-BEDVo_4L.js";
import "./webhook-ingress-KrGlV9-3.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-Bpxq-Zvh.js";
import "./web-media-BFBS6C3r.js";
import "./outbound-media-DUQMvysg.js";
//#region src/plugin-sdk/googlechat.ts
function resolveGoogleChatGroupRequireMention(params) {
	return resolveChannelGroupRequireMention({
		cfg: params.cfg,
		channel: "googlechat",
		groupId: params.groupId,
		accountId: params.accountId
	});
}
const googlechatSetup = createOptionalChannelSetupSurface({
	channel: "googlechat",
	label: "Google Chat",
	npmSpec: "@openclaw/googlechat",
	docsPath: "/channels/googlechat"
});
const googlechatSetupAdapter = googlechatSetup.setupAdapter;
const googlechatSetupWizard = googlechatSetup.setupWizard;
//#endregion
export { googlechatSetupWizard as n, resolveGoogleChatGroupRequireMention as r, googlechatSetupAdapter as t };
