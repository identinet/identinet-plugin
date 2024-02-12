import { createSignal } from "solid-js";

export const [fetchStatus, forceRefetch] = createSignal(false);
