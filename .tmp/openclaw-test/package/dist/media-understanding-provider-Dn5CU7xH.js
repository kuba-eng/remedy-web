import { n as describeImagesWithModel, t as describeImageWithModel } from "./image-runtime-30ha_rLv.js";
import "./media-understanding-DslTqfX0.js";
//#region extensions/anthropic/media-understanding-provider.ts
const anthropicMediaUnderstandingProvider = {
	id: "anthropic",
	capabilities: ["image"],
	defaultModels: { image: "claude-opus-4-6" },
	autoPriority: { image: 20 },
	nativeDocumentInputs: ["pdf"],
	describeImage: describeImageWithModel,
	describeImages: describeImagesWithModel
};
//#endregion
export { anthropicMediaUnderstandingProvider as t };
