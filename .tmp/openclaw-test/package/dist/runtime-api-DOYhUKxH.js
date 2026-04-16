import { t as createPluginRuntimeStore } from "./runtime-store-Cvr8bl0h.js";
import "./channel-policy-Du0WjQuj.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import "./channel-pairing-DTvM6AVp.js";
import "./webhook-request-guards-Df6jC-7E.js";
import "./webhook-targets-CBZjdIw_.js";
import "./config-runtime-B-XcrPKd.js";
import "./outbound-media-DUQMvysg.js";
import "./ssrf-runtime-CmuKDV7X.js";
import "./media-runtime-C8DbMGvw.js";
import "./channel-config-primitives-Ccn13KYW.js";
import "./channel-actions-zUgiO578.js";
import "./channel-feedback-BY4_UkuM.js";
import "./channel-inbound-_CjusQAI.js";
import "./channel-lifecycle-HUGEYnJt.js";
import "./googlechat-runtime-shared-CM8DmJL6.js";
import "./channel-status-psq-AHLE.js";
//#region extensions/googlechat/src/runtime.ts
const { setRuntime: setGoogleChatRuntime, getRuntime: getGoogleChatRuntime } = createPluginRuntimeStore({
	pluginId: "googlechat",
	errorMessage: "Google Chat runtime not initialized"
});
//#endregion
export { setGoogleChatRuntime as n, getGoogleChatRuntime as t };
