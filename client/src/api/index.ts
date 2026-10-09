import { Api } from "./Api";

// The frontend and backend share one origin after deployment.
export const api = new Api({ baseUrl: "" });

export * from "./Api";