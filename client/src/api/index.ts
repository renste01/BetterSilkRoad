import { Api } from "./Api";

// One shared client instance, pointed at the backend.
export const api = new Api({ baseUrl: "http://localhost:5153" });

export * from "./Api";