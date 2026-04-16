import { t as defineSingleProviderPluginEntry } from "../../provider-entry-DT9p-rO8.js";
import { t as buildMistralProvider } from "../../provider-catalog-DHr0mqUo.js";
import { n as applyMistralConfig, t as MISTRAL_DEFAULT_MODEL_REF } from "../../onboard-u28XsqUg.js";
import { i as applyMistralModelCompat } from "../../api-CeYqe1sE.js";
import { t as mistralMediaUnderstandingProvider } from "../../media-understanding-provider-DS7MXDxv.js";
import { t as contributeMistralResolvedModelCompat } from "../../provider-compat-BBKnbPxg.js";
//#region extensions/mistral/index.ts
const PROVIDER_ID = "mistral";
function buildMistralReplayPolicy() {
	return {
		sanitizeToolCallIds: true,
		toolCallIdMode: "strict9"
	};
}
var mistral_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Mistral Provider",
	description: "Bundled Mistral provider plugin",
	provider: {
		label: "Mistral",
		docsPath: "/providers/models",
		auth: [{
			methodId: "api-key",
			label: "Mistral API key",
			hint: "API key",
			optionKey: "mistralApiKey",
			flagName: "--mistral-api-key",
			envVar: "MISTRAL_API_KEY",
			promptMessage: "Enter Mistral API key",
			defaultModel: MISTRAL_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyMistralConfig(cfg),
			wizard: { groupLabel: "Mistral AI" }
		}],
		catalog: {
			buildProvider: buildMistralProvider,
			allowExplicitBaseUrl: true
		},
		matchesContextOverflowError: ({ errorMessage }) => /\bmistral\b.*(?:input.*too long|token limit.*exceeded)/i.test(errorMessage),
		normalizeResolvedModel: ({ model }) => applyMistralModelCompat(model),
		contributeResolvedModelCompat: ({ modelId, model }) => contributeMistralResolvedModelCompat({
			modelId,
			model
		}),
		buildReplayPolicy: () => buildMistralReplayPolicy()
	},
	register(api) {
		api.registerMediaUnderstandingProvider(mistralMediaUnderstandingProvider);
	}
});
//#endregion
export { buildMistralReplayPolicy, mistral_default as default };
