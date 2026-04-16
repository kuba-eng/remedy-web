import { r as registerCoreCliCommands } from "./command-registry-core-BopmmXs5.js";
import { n as registerSubCliCommands } from "./register.subclis-CxkAeBGb.js";
//#region src/cli/program/command-registry.ts
function registerProgramCommands(program, ctx, argv = process.argv) {
	registerCoreCliCommands(program, ctx, argv);
	registerSubCliCommands(program, argv);
}
//#endregion
export { registerProgramCommands as t };
