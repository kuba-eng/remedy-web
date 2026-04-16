import { d as readStringValue } from "./string-coerce-BUSzWgUA.js";
import { r as normalizeProviderId } from "./provider-id-KaStHhRz.js";
import { n as resolveProviderEndpoint } from "./provider-attribution-CAPWz-u0.js";
import "./provider-tools-CvlDOL3Y.js";
import { o as getModelProviderHint } from "./provider-model-shared-DTkCg-KW.js";
import "./text-runtime-BSu7DBcn.js";
import "./model-definitions-9CJ8x67B.js";
import "./provider-catalog-D-zho0KP.js";
import "./onboard-2AksefGg.js";
import "./provider-models-CGpZBV81.js";
//#region extensions/xai/api.ts
function isXaiNativeEndpoint(baseUrl) {
	return typeof baseUrl === "string" && resolveProviderEndpoint(baseUrl).endpointClass === "xai-native";
}
function isXaiModelHint(modelId) {
	return getModelProviderHint(modelId) === "x-ai";
}
function shouldUseXaiResponsesTransport(params) {
	if (params.api !== "openai-completions") return false;
	if (isXaiNativeEndpoint(params.baseUrl)) return true;
	return normalizeProviderId(params.provider) === "xai" && !params.baseUrl;
}
function shouldContributeXaiCompat(params) {
	if (params.model.api !== "openai-completions") return false;
	return isXaiNativeEndpoint(params.model.baseUrl) || isXaiModelHint(params.modelId);
}
function resolveXaiTransport(params) {
	if (!shouldUseXaiResponsesTransport(params)) return;
	return {
		api: "openai-responses",
		baseUrl: readStringValue(params.baseUrl)
	};
}
//#endregion
export { resolveXaiTransport as n, shouldContributeXaiCompat as r, isXaiModelHint as t };
