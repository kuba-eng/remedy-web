import "./subsystem-Cgmckbux.js";
import "./provider-env-vars-BqcdRtx5.js";
import "./failover-error-LlwtzBSE.js";
import "./provider-registry-D9Fp3YOW.js";
import "./runtime-shared-DRvEhjBq.js";
import "./provider-model-shared-DTkCg-KW.js";
import "./provider-model-defaults-B_0xTJ0S.js";
//#region src/plugin-sdk/image-generation-core.ts
let imageGenerationCoreAuthRuntimePromise;
async function loadImageGenerationCoreAuthRuntime() {
	imageGenerationCoreAuthRuntimePromise ??= import("./image-generation-core.auth.runtime-DDal3gnG.js");
	return imageGenerationCoreAuthRuntimePromise;
}
async function resolveApiKeyForProvider(...args) {
	return (await loadImageGenerationCoreAuthRuntime()).resolveApiKeyForProvider(...args);
}
//#endregion
export { resolveApiKeyForProvider as t };
