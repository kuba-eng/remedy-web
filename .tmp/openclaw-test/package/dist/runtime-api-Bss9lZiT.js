import "./provider-model-shared-DTkCg-KW.js";
import "./core-D8GhZMD9.js";
import "./routing-BI8_fMua.js";
import { t as createPluginRuntimeStore } from "./runtime-store-Cvr8bl0h.js";
import "./channel-policy-Du0WjQuj.js";
import "./reply-history-DTh6o1-h.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import "./channel-pairing-DTvM6AVp.js";
import "./webhook-targets-CBZjdIw_.js";
import "./webhook-ingress-KrGlV9-3.js";
import "./setup-DNsPImrH.js";
import "./config-runtime-B-XcrPKd.js";
import "./agent-media-payload-D_-uGY_i.js";
import "./outbound-media-DUQMvysg.js";
import "./media-runtime-C8DbMGvw.js";
import "./browser-node-runtime-BUZ49s7D.js";
import "./command-auth-B2fYrsNq.js";
import "./channel-feedback-BY4_UkuM.js";
import "./channel-inbound-_CjusQAI.js";
import "./channel-lifecycle-HUGEYnJt.js";
import "./channel-status-psq-AHLE.js";
//#region extensions/mattermost/src/runtime.ts
const { setRuntime: setMattermostRuntime, getRuntime: getMattermostRuntime } = createPluginRuntimeStore({
	pluginId: "mattermost",
	errorMessage: "Mattermost runtime not initialized"
});
//#endregion
export { setMattermostRuntime as n, getMattermostRuntime as t };
