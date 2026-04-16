import "./session-binding-service-CP3mZirT.js";
import "./binding-registry-B0KJsX4-.js";
import "./conversation-binding-DCRzz-4f.js";
import "./session-DDgLuLV7.js";
import "./pairing-store-C5z1LtuO.js";
import "./dm-policy-shared-B8t-T2Dt.js";
import "./binding-targets-YpC9-IJE.js";
import "./binding-routing-DnN5L0Wy.js";
import "./thread-bindings-policy-xmxZFutO.js";
import "./pairing-labels-C6_I7b4s.js";
//#region src/channels/session-meta.ts
let inboundSessionRuntimePromise = null;
function loadInboundSessionRuntime() {
	inboundSessionRuntimePromise ??= import("./inbound.runtime-xTbk__cF.js");
	return inboundSessionRuntimePromise;
}
async function recordInboundSessionMetaSafe(params) {
	const runtime = await loadInboundSessionRuntime();
	const storePath = runtime.resolveStorePath(params.cfg.session?.store, { agentId: params.agentId });
	try {
		await runtime.recordSessionMetaFromInbound({
			storePath,
			sessionKey: params.sessionKey,
			ctx: params.ctx
		});
	} catch (err) {
		params.onError?.(err);
	}
}
//#endregion
export { recordInboundSessionMetaSafe as t };
