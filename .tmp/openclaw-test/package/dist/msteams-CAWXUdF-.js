import "./utils-D5DtWkEu.js";
import "./types.secrets-CeL3gSMO.js";
import "./config-schema-B6Z7tngN.js";
import "./zod-schema.providers-core-ucwMwbqH.js";
import "./file-lock-ByJeCMLs.js";
import "./tokens-C0hh0kYg.js";
import "./mime-B6nXlmtY.js";
import "./fetch-guard-B3p4gGaY.js";
import "./ssrf-DoOclwFS.js";
import "./store-CFeRgpZO.js";
import "./json-store-iQhnwImo.js";
import "./dm-policy-shared-B8t-T2Dt.js";
import "./history-BexnEA43.js";
import "./setup-wizard-helpers-DPfZaq_K.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import "./channel-pairing-DTvM6AVp.js";
import "./status-helpers-BEDVo_4L.js";
import "./http-body-CmkD5yuo.js";
import { t as createOptionalChannelSetupSurface } from "./channel-setup-Bpxq-Zvh.js";
import "./inbound-reply-dispatch-CE-veNW1.js";
import "./web-media-BFBS6C3r.js";
import "./outbound-media-DUQMvysg.js";
import "./ssrf-policy-CChtVzhj.js";
import "./session-envelope-C3Xr0vva.js";
//#region src/plugin-sdk/msteams.ts
const msteamsSetup = createOptionalChannelSetupSurface({
	channel: "msteams",
	label: "Microsoft Teams",
	npmSpec: "@openclaw/msteams",
	docsPath: "/channels/msteams"
});
const msteamsSetupWizard = msteamsSetup.setupWizard;
const msteamsSetupAdapter = msteamsSetup.setupAdapter;
//#endregion
export { msteamsSetupWizard as n, msteamsSetupAdapter as t };
