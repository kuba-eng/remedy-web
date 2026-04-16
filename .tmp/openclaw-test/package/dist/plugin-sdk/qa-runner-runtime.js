import { t as loadPluginManifestRegistry } from "../manifest-registry-C5lkvfrj.js";
import { n as loadBundledPluginPublicSurfaceModuleSync, r as tryLoadActivatedBundledPluginPublicSurfaceModuleSync } from "../facade-runtime-JIv_QyNd.js";
//#region src/plugin-sdk/qa-runner-runtime.ts
function isMissingQaRuntimeError(error) {
	if (!(error instanceof Error)) return false;
	return error.message.includes("qa-lab") && (error.message.includes("runtime-api.js") || error.message.startsWith("Unable to open bundled plugin public surface "));
}
function loadQaRuntimeModule() {
	return loadBundledPluginPublicSurfaceModuleSync({
		dirName: ["qa", "lab"].join("-"),
		artifactBasename: ["runtime-api", "js"].join(".")
	});
}
function isQaRuntimeAvailable() {
	try {
		loadQaRuntimeModule();
		return true;
	} catch (error) {
		if (isMissingQaRuntimeError(error)) return false;
		throw error;
	}
}
function listDeclaredQaRunnerPlugins() {
	return loadPluginManifestRegistry({ cache: true }).plugins.filter((plugin) => Array.isArray(plugin.qaRunners) && plugin.qaRunners.length > 0).toSorted((left, right) => {
		const idCompare = left.id.localeCompare(right.id);
		if (idCompare !== 0) return idCompare;
		return left.rootDir.localeCompare(right.rootDir);
	});
}
function indexRuntimeRegistrations(pluginId, surface) {
	const registrations = surface.qaRunnerCliRegistrations ?? [];
	const registrationByCommandName = /* @__PURE__ */ new Map();
	for (const registration of registrations) {
		if (!registration?.commandName || typeof registration.register !== "function") throw new Error(`QA runner plugin "${pluginId}" exported an invalid CLI registration`);
		if (registrationByCommandName.has(registration.commandName)) throw new Error(`QA runner plugin "${pluginId}" exported duplicate CLI registration "${registration.commandName}"`);
		registrationByCommandName.set(registration.commandName, registration);
	}
	return registrationByCommandName;
}
function loadQaRunnerRuntimeSurface(plugin) {
	if (plugin.origin === "bundled") return loadBundledPluginPublicSurfaceModuleSync({
		dirName: plugin.id,
		artifactBasename: "runtime-api.js"
	});
	return tryLoadActivatedBundledPluginPublicSurfaceModuleSync({
		dirName: plugin.id,
		artifactBasename: "runtime-api.js"
	});
}
function listQaRunnerCliContributions() {
	const contributions = /* @__PURE__ */ new Map();
	for (const plugin of listDeclaredQaRunnerPlugins()) {
		const runtimeSurface = loadQaRunnerRuntimeSurface(plugin);
		const runtimeRegistrationByCommandName = runtimeSurface ? indexRuntimeRegistrations(plugin.id, runtimeSurface) : null;
		const declaredCommandNames = new Set(plugin.qaRunners.map((runner) => runner.commandName));
		for (const runner of plugin.qaRunners) {
			const previous = contributions.get(runner.commandName);
			if (previous && previous.pluginId !== plugin.id) throw new Error(`QA runner command "${runner.commandName}" declared by both "${previous.pluginId}" and "${plugin.id}"`);
			const registration = runtimeRegistrationByCommandName?.get(runner.commandName);
			if (!runtimeSurface) {
				contributions.set(runner.commandName, {
					pluginId: plugin.id,
					commandName: runner.commandName,
					...runner.description ? { description: runner.description } : {},
					status: "blocked"
				});
				continue;
			}
			if (!registration) throw new Error(`QA runner plugin "${plugin.id}" declared "${runner.commandName}" in openclaw.plugin.json but did not export a matching CLI registration`);
			contributions.set(runner.commandName, {
				pluginId: plugin.id,
				commandName: runner.commandName,
				...runner.description ? { description: runner.description } : {},
				status: "available",
				registration
			});
		}
		for (const commandName of runtimeRegistrationByCommandName?.keys() ?? []) if (!declaredCommandNames.has(commandName)) throw new Error(`QA runner plugin "${plugin.id}" exported "${commandName}" from runtime-api.js but did not declare it in openclaw.plugin.json`);
	}
	return [...contributions.values()];
}
//#endregion
export { isQaRuntimeAvailable, listQaRunnerCliContributions, loadQaRuntimeModule };
