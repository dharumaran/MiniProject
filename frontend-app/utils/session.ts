import {
  deleteFromSecureStore,
  getJsonFromSecureStore,
  saveJsonToSecureStore,
} from "./secureStorage";
import type { AuthSession, User } from "./types";

const SESSION_KEY = "authSession";

export async function saveSession(user: User) {
  await saveJsonToSecureStore<AuthSession>(SESSION_KEY, { user });
}

export async function getSession() {
  return getJsonFromSecureStore<AuthSession>(SESSION_KEY);
}

export async function clearSession() {
  await deleteFromSecureStore(SESSION_KEY);
}
