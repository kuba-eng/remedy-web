import { a as buildProviderToolCompatFamilyHooks } from "../../provider-tools-CvlDOL3Y.js";
import { t as definePluginEntry } from "../../plugin-entry-Bkat4og3.js";
import { t as buildOpenAICodexCliBackend } from "../../cli-backend-DutKWYGz.js";
import { t as buildOpenAIImageGenerationProvider } from "../../image-generation-provider-DWYj77IU.js";
import { n as openaiCodexMediaUnderstandingProvider, r as openaiMediaUnderstandingProvider } from "../../media-understanding-provider-D5ZBxEfq.js";
import { t as buildOpenAICodexProviderPlugin } from "../../openai-codex-provider-V-RgaPyC.js";
import { t as buildOpenAIProvider } from "../../openai-provider-HQ-htdN2.js";
import { a as resolveOpenAIPromptOverlayMode, o as resolveOpenAISystemPromptContribution } from "../../prompt-overlay-DQrYlaMK.js";
import { t as buildOpenAIRealtimeTranscriptionProvider } from "../../realtime-transcription-provider-BTwKwJ23.js";
import { t as buildOpenAIRealtimeVoiceProvider } from "../../realtime-voice-provider-C1jE-T8f.js";
import { t as buildOpenAISpeechProvider } from "../../speech-provider-BKVI6NAO.js";
import { t as buildOpenAIVideoGenerationProvider } from "../../video-generation-provider-B1b_GyNl.js";
//#region extensions/openai/index.ts
var openai_default = definePluginEntry({
	id: "openai",
	name: "OpenAI Provider",
	description: "Bundled OpenAI provider plugins",
	register(api) {
		const promptOverlayMode = resolveOpenAIPromptOverlayMode(api.pluginConfig);
		const openAIToolCompatHooks = buildProviderToolCompatFamilyHooks("openai");
		const buildProviderWithPromptContribution = (provider) => ({
			...provider,
			...openAIToolCompatHooks,
			resolveSystemPromptContribution: (ctx) => resolveOpenAISystemPromptContribution({
				mode: promptOverlayMode,
				modelProviderId: provider.id,
				modelId: ctx.modelId
			})
		});
		api.registerCliBackend(buildOpenAICodexCliBackend());
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAIProvider()));
		api.registerProvider(buildProviderWithPromptContribution(buildOpenAICodexProviderPlugin()));
		api.registerImageGenerationProvider(buildOpenAIImageGenerationProvider());
		api.registerRealtimeTranscriptionProvider(buildOpenAIRealtimeTranscriptionProvider());
		api.registerRealtimeVoiceProvider(buildOpenAIRealtimeVoiceProvider());
		api.registerSpeechProvider(buildOpenAISpeechProvider());
		api.registerMediaUnderstandingProvider(openaiMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(openaiCodexMediaUnderstandingProvider);
		api.registerVideoGenerationProvider(buildOpenAIVideoGenerationProvider());
	}
});
//#endregion
export { openai_default as default };
