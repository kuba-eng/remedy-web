import "./core-D8GhZMD9.js";
import "./secret-input-BEMaS7ol.js";
import { t as createPluginRuntimeStore } from "./runtime-store-Cvr8bl0h.js";
import "./channel-reply-pipeline-BPqhgZj2.js";
import "./channel-pairing-DTvM6AVp.js";
import "./status-helpers-BEDVo_4L.js";
import "./webhook-ingress-KrGlV9-3.js";
import "./runtime-BwzKQAfC.js";
import "./setup-DNsPImrH.js";
import "./config-runtime-B-XcrPKd.js";
import "./command-auth-B2fYrsNq.js";
import "./channel-feedback-BY4_UkuM.js";
import "./channel-status-psq-AHLE.js";
//#region extensions/zalo/src/runtime.ts
const { setRuntime: setZaloRuntime, getRuntime: getZaloRuntime } = createPluginRuntimeStore({
	pluginId: "zalo",
	errorMessage: "Zalo runtime not initialized"
});
//#endregion
export { setZaloRuntime as n, getZaloRuntime as t };
