import { s as normalizeOptionalString } from "./string-coerce-BUSzWgUA.js";
import { i as coerceSecretRef } from "./types.secrets-CeL3gSMO.js";
import { m as resolveNonEnvSecretRefApiKeyMarker } from "./model-auth-markers-XpcQ9Ze3.js";
import "./text-runtime-BSu7DBcn.js";
import "./provider-auth-DraK8T1m.js";
import { a as resolveCloudflareAiGatewayBaseUrl, i as buildCloudflareAiGatewayModelDefinition } from "./models-rCbZb2KB.js";
//#region extensions/cloudflare-ai-gateway/catalog-provider.ts
function resolveCloudflareAiGatewayApiKey(cred) {
	if (!cred || cred.type !== "api_key") return;
	const keyRef = coerceSecretRef(cred.keyRef);
	const keyRefId = normalizeOptionalString(keyRef?.id);
	if (keyRef && keyRefId) return keyRef.source === "env" ? keyRefId : resolveNonEnvSecretRefApiKeyMarker(keyRef.source);
	return normalizeOptionalString(cred.key);
}
function resolveCloudflareAiGatewayMetadata(cred) {
	if (!cred || cred.type !== "api_key") return {};
	return {
		accountId: normalizeOptionalString(cred.metadata?.accountId),
		gatewayId: normalizeOptionalString(cred.metadata?.gatewayId)
	};
}
function buildCloudflareAiGatewayCatalogProvider(params) {
	const apiKey = normalizeOptionalString(params.envApiKey) ?? resolveCloudflareAiGatewayApiKey(params.credential);
	if (!apiKey) return null;
	const { accountId, gatewayId } = resolveCloudflareAiGatewayMetadata(params.credential);
	if (!accountId || !gatewayId) return null;
	const baseUrl = resolveCloudflareAiGatewayBaseUrl({
		accountId,
		gatewayId
	});
	if (!baseUrl) return null;
	return {
		baseUrl,
		api: "anthropic-messages",
		apiKey,
		models: [buildCloudflareAiGatewayModelDefinition()]
	};
}
//#endregion
export { resolveCloudflareAiGatewayApiKey as n, resolveCloudflareAiGatewayMetadata as r, buildCloudflareAiGatewayCatalogProvider as t };
