import { i as PASSTHROUGH_GEMINI_REPLAY_HOOKS } from "../../provider-model-shared-DTkCg-KW.js";
import { n as readConfiguredProviderCatalogEntries } from "../../provider-catalog-shared-De0RyIxG.js";
import { t as defineSingleProviderPluginEntry } from "../../provider-entry-DT9p-rO8.js";
import { n as KILOCODE_THINKING_STREAM_HOOKS } from "../../provider-stream-Cvw3iC95.js";
import "../../provider-stream-family-B9k8nsTe.js";
import { s as KILOCODE_DEFAULT_MODEL_REF } from "../../provider-models-D6Q1riIj.js";
import { n as buildKilocodeProviderWithDiscovery } from "../../provider-catalog-CqFCVvZw.js";
import { t as applyKilocodeConfig } from "../../onboard-BFTSJtux.js";
//#region extensions/kilocode/index.ts
const PROVIDER_ID = "kilocode";
var kilocode_default = defineSingleProviderPluginEntry({
	id: PROVIDER_ID,
	name: "Kilo Gateway Provider",
	description: "Bundled Kilo Gateway provider plugin",
	provider: {
		label: "Kilo Gateway",
		docsPath: "/providers/kilocode",
		auth: [{
			methodId: "api-key",
			label: "Kilo Gateway API key",
			hint: "API key (OpenRouter-compatible)",
			optionKey: "kilocodeApiKey",
			flagName: "--kilocode-api-key",
			envVar: "KILOCODE_API_KEY",
			promptMessage: "Enter Kilo Gateway API key",
			defaultModel: KILOCODE_DEFAULT_MODEL_REF,
			applyConfig: (cfg) => applyKilocodeConfig(cfg)
		}],
		catalog: { buildProvider: buildKilocodeProviderWithDiscovery },
		augmentModelCatalog: ({ config }) => readConfiguredProviderCatalogEntries({
			config,
			providerId: PROVIDER_ID
		}),
		...PASSTHROUGH_GEMINI_REPLAY_HOOKS,
		...KILOCODE_THINKING_STREAM_HOOKS,
		isCacheTtlEligible: (ctx) => ctx.modelId.startsWith("anthropic/")
	}
});
//#endregion
export { kilocode_default as default };
