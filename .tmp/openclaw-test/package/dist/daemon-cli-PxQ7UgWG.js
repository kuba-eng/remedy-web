import { t as formatDocsLink } from "./links-Dp5-Wbn2.js";
import { r as theme } from "./theme-D5sxSdHD.js";
import { t as addGatewayServiceCommands } from "./register-service-commands-1NwAv5wm.js";
import "./install-DbT1mISF.js";
import "./lifecycle-H2oBHBAs.js";
import "./status-D9JAuPf1.js";
//#region src/cli/daemon-cli/register.ts
function registerDaemonCli(program) {
	addGatewayServiceCommands(program.command("daemon").description("Manage the Gateway service (launchd/systemd/schtasks)").addHelpText("after", () => `\n${theme.muted("Docs:")} ${formatDocsLink("/cli/gateway", "docs.openclaw.ai/cli/gateway")}\n`), { statusDescription: "Show service install status + probe the Gateway" });
}
//#endregion
export { registerDaemonCli as t };
