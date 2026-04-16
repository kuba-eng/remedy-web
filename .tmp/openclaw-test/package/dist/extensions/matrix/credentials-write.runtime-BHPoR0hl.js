//#region extensions/matrix/src/matrix/credentials-write.runtime.ts
async function saveMatrixCredentials(...args) {
	return (await import("./credentials-PgXTw6sn.js")).saveMatrixCredentials(...args);
}
async function saveBackfilledMatrixDeviceId(...args) {
	return (await import("./credentials-PgXTw6sn.js")).saveBackfilledMatrixDeviceId(...args);
}
async function touchMatrixCredentials(...args) {
	return (await import("./credentials-PgXTw6sn.js")).touchMatrixCredentials(...args);
}
//#endregion
export { saveBackfilledMatrixDeviceId, saveMatrixCredentials, touchMatrixCredentials };
