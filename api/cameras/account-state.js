import { getCameraAccountErrorStatus, getCameraAccountState } from "../../server/camera-sync-store.js";

export default async function handler(request, response) {
  response.setHeader("cache-control", "no-store");

  if (request.method !== "GET") {
    response.setHeader("allow", "GET");
    return response.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { account, records, storage } = await getCameraAccountState(request);
    return response.status(200).json({
      account: {
        userId: account.userId,
        authMode: account.authMode,
        authenticated: account.authenticated,
        hardGate: account.hardGate
      },
      storage,
      counts: Object.fromEntries(Object.entries(records).map(([collection, items]) => [collection, items.length])),
      records
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to read camera account state.";
    return response.status(getCameraAccountErrorStatus(error)).json({ error: message });
  }
}
