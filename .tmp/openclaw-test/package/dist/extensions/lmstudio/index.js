import { t as createSubsystemLogger } from "../../subsystem-Cgmckbux.js";
import { t as CUSTOM_LOCAL_AUTH_MARKER } from "../../model-auth-markers-XpcQ9Ze3.js";
import { t as definePluginEntry } from "../../plugin-entry-Bkat4og3.js";
import "../../provider-auth-DraK8T1m.js";
import "../../logging-core-CqXBUxbp.js";
import { C as LMSTUDIO_DEFAULT_API_KEY_ENV_VAR, M as LMSTUDIO_PROVIDER_LABEL, c as resolveLmstudioRuntimeApiKey, f as shouldUseLmstudioSyntheticAuth, g as normalizeLmstudioConfiguredCatalogEntries, j as LMSTUDIO_PROVIDER_ID, n as ensureLmstudioModelLoaded, o as resolveLmstudioProviderHeaders, v as normalizeLmstudioProviderConfig, y as resolveLmstudioInferenceBase } from "../../models.fetch-ap8VYlIj.js";
import { streamSimple } from "@mariozechner/pi-ai";
//#region extensions/lmstudio/src/stream.ts
const log = createSubsystemLogger("extensions/lmstudio/stream");
const preloadInFlight = /* @__PURE__ */ new Map();
function normalizeLmstudioModelKey(modelId) {
	const trimmed = modelId.trim();
	if (trimmed.toLowerCase().startsWith("lmstudio/")) return trimmed.slice(9).trim();
	return trimmed;
}
function resolveRequestedContextLength(model) {
	const withContextTokens = model;
	const contextTokens = typeof withContextTokens.contextTokens === "number" && Number.isFinite(withContextTokens.contextTokens) ? Math.floor(withContextTokens.contextTokens) : void 0;
	if (contextTokens && contextTokens > 0) return contextTokens;
	const contextWindow = typeof model.contextWindow === "number" && Number.isFinite(model.contextWindow) ? Math.floor(model.contextWindow) : void 0;
	if (contextWindow && contextWindow > 0) return contextWindow;
}
function resolveModelHeaders(model) {
	if (!model.headers || typeof model.headers !== "object" || Array.isArray(model.headers)) return;
	return model.headers;
}
function createPreloadKey(params) {
	return `${params.baseUrl}::${params.modelKey}::${params.requestedContextLength ?? "default"}`;
}
function buildLmstudioPreloadSsrFPolicy(baseUrl) {
	const trimmed = baseUrl.trim();
	if (!trimmed) return;
	try {
		const parsed = new URL(trimmed);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return;
		return { allowedHostnames: [parsed.hostname] };
	} catch {
		return;
	}
}
async function ensureLmstudioModelLoadedBestEffort(params) {
	const providerHeaders = {
		...(params.ctx.config?.models?.providers?.[LMSTUDIO_PROVIDER_ID])?.headers,
		...params.modelHeaders
	};
	const runtimeApiKey = typeof params.options?.apiKey === "string" && params.options.apiKey.trim().length > 0 ? params.options.apiKey.trim() : void 0;
	const headers = await resolveLmstudioProviderHeaders({
		config: params.ctx.config,
		headers: providerHeaders
	});
	const configuredApiKey = runtimeApiKey !== void 0 ? void 0 : await resolveLmstudioRuntimeApiKey({
		config: params.ctx.config,
		agentDir: params.ctx.agentDir,
		headers: providerHeaders
	});
	await ensureLmstudioModelLoaded({
		baseUrl: params.baseUrl,
		apiKey: runtimeApiKey ?? configuredApiKey,
		headers,
		ssrfPolicy: buildLmstudioPreloadSsrFPolicy(params.baseUrl),
		modelKey: params.modelKey,
		requestedContextLength: params.requestedContextLength
	});
}
function wrapLmstudioInferencePreload(ctx) {
	const underlying = ctx.streamFn ?? streamSimple;
	return (model, context, options) => {
		if (model.provider !== "lmstudio") return underlying(model, context, options);
		const modelKey = normalizeLmstudioModelKey(model.id);
		if (!modelKey) return underlying(model, context, options);
		const providerBaseUrl = ctx.config?.models?.providers?.[LMSTUDIO_PROVIDER_ID]?.baseUrl;
		const resolvedBaseUrl = resolveLmstudioInferenceBase(typeof model.baseUrl === "string" ? model.baseUrl : providerBaseUrl);
		const requestedContextLength = resolveRequestedContextLength(model);
		const preloadKey = createPreloadKey({
			baseUrl: resolvedBaseUrl,
			modelKey,
			requestedContextLength
		});
		const existing = preloadInFlight.get(preloadKey);
		const preloadPromise = existing ?? ensureLmstudioModelLoadedBestEffort({
			baseUrl: resolvedBaseUrl,
			modelKey,
			requestedContextLength,
			options,
			ctx,
			modelHeaders: resolveModelHeaders(model)
		}).finally(() => {
			preloadInFlight.delete(preloadKey);
		});
		if (!existing) preloadInFlight.set(preloadKey, preloadPromise);
		return (async () => {
			try {
				await preloadPromise;
			} catch (error) {
				log.warn(`LM Studio inference preload failed for "${modelKey}"; continuing without preload: ${String(error)}`);
			}
			const stream = underlying({
				...model,
				compat: {
					...model.compat && typeof model.compat === "object" ? model.compat : {},
					supportsUsageInStreaming: true
				}
			}, context, options);
			return stream instanceof Promise ? await stream : stream;
		})();
	};
}
//#endregion
//#region extensions/lmstudio/index.ts
const PROVIDER_ID = "lmstudio";
const cachedDynamicModels = /* @__PURE__ */ new Map();
function resolveLmstudioAugmentedCatalogEntries(config) {
	if (!config) return [];
	return normalizeLmstudioConfiguredCatalogEntries(config.models?.providers?.lmstudio?.models).map((entry) => ({
		provider: PROVIDER_ID,
		id: entry.id,
		name: entry.name ?? entry.id,
		compat: { supportsUsageInStreaming: true },
		contextWindow: entry.contextWindow,
		contextTokens: entry.contextTokens,
		reasoning: entry.reasoning,
		input: entry.input
	}));
}
/** Lazily loads setup helpers so provider wiring stays lightweight at startup. */
async function loadProviderSetup() {
	return await import("./api.js");
}
var lmstudio_default = definePluginEntry({
	id: PROVIDER_ID,
	name: "LM Studio Provider",
	description: "Bundled LM Studio provider plugin",
	register(api) {
		api.registerProvider({
			id: PROVIDER_ID,
			label: "LM Studio",
			docsPath: "/providers/lmstudio",
			envVars: [LMSTUDIO_DEFAULT_API_KEY_ENV_VAR],
			auth: [{
				id: "custom",
				label: LMSTUDIO_PROVIDER_LABEL,
				hint: "Local/self-hosted LM Studio server",
				kind: "custom",
				run: async (ctx) => {
					return await (await loadProviderSetup()).promptAndConfigureLmstudioInteractive({
						config: ctx.config,
						prompter: ctx.prompter,
						secretInputMode: ctx.secretInputMode,
						allowSecretRefPrompt: ctx.allowSecretRefPrompt
					});
				},
				runNonInteractive: async (ctx) => {
					return await (await loadProviderSetup()).configureLmstudioNonInteractive(ctx);
				}
			}],
			discovery: {
				order: "late",
				run: async (ctx) => {
					return await (await loadProviderSetup()).discoverLmstudioProvider(ctx);
				}
			},
			resolveSyntheticAuth: ({ providerConfig }) => {
				if (!shouldUseLmstudioSyntheticAuth(providerConfig)) return;
				return {
					apiKey: CUSTOM_LOCAL_AUTH_MARKER,
					source: "models.providers.lmstudio (synthetic local key)",
					mode: "api-key"
				};
			},
			shouldDeferSyntheticProfileAuth: ({ resolvedApiKey }) => resolvedApiKey?.trim() === "lmstudio-local" || resolvedApiKey?.trim() === "custom-local",
			normalizeConfig: ({ providerConfig }) => normalizeLmstudioProviderConfig(providerConfig),
			prepareDynamicModel: async (ctx) => {
				const providerSetup = await loadProviderSetup();
				cachedDynamicModels.set(ctx.providerConfig?.baseUrl ?? "", await providerSetup.prepareLmstudioDynamicModels(ctx));
			},
			resolveDynamicModel: (ctx) => cachedDynamicModels.get(ctx.providerConfig?.baseUrl ?? "")?.find((model) => model.id === ctx.modelId),
			augmentModelCatalog: (ctx) => resolveLmstudioAugmentedCatalogEntries(ctx.config),
			wrapStreamFn: wrapLmstudioInferencePreload,
			wizard: {
				setup: {
					choiceId: PROVIDER_ID,
					choiceLabel: "LM Studio",
					choiceHint: "Local/self-hosted LM Studio server",
					groupId: PROVIDER_ID,
					groupLabel: "LM Studio",
					groupHint: "Self-hosted open-weight models",
					methodId: "custom"
				},
				modelPicker: {
					label: "LM Studio (custom)",
					hint: "Detect models from LM Studio /api/v1/models",
					methodId: "custom"
				}
			}
		});
	}
});
//#endregion
export { lmstudio_default as default };
