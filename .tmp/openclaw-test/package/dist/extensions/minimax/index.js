import { t as definePluginEntry } from "../../plugin-entry-Bkat4og3.js";
import { n as buildMinimaxPortalImageGenerationProvider, t as buildMinimaxImageGenerationProvider } from "../../image-generation-provider-7C4FAbNn.js";
import { n as minimaxPortalMediaUnderstandingProvider, t as minimaxMediaUnderstandingProvider } from "../../media-understanding-provider-ys5VGS7y.js";
import { t as buildMinimaxMusicGenerationProvider } from "../../music-generation-provider-tyXLJgC2.js";
import { t as registerMinimaxProviders } from "../../provider-registration-ZJNH1Z-l.js";
import { t as buildMinimaxSpeechProvider } from "../../speech-provider-B-j0woEG.js";
import { t as createMiniMaxWebSearchProvider } from "../../minimax-web-search-provider-BIRAvX0z.js";
import { t as buildMinimaxVideoGenerationProvider } from "../../video-generation-provider-BpC31QXo.js";
//#region extensions/minimax/index.ts
var minimax_default = definePluginEntry({
	id: "minimax",
	name: "MiniMax",
	description: "Bundled MiniMax API-key and OAuth provider plugin",
	register(api) {
		registerMinimaxProviders(api);
		api.registerMediaUnderstandingProvider(minimaxMediaUnderstandingProvider);
		api.registerMediaUnderstandingProvider(minimaxPortalMediaUnderstandingProvider);
		api.registerImageGenerationProvider(buildMinimaxImageGenerationProvider());
		api.registerImageGenerationProvider(buildMinimaxPortalImageGenerationProvider());
		api.registerMusicGenerationProvider(buildMinimaxMusicGenerationProvider());
		api.registerVideoGenerationProvider(buildMinimaxVideoGenerationProvider());
		api.registerSpeechProvider(buildMinimaxSpeechProvider());
		api.registerWebSearchProvider(createMiniMaxWebSearchProvider());
	}
});
//#endregion
export { minimax_default as default };
