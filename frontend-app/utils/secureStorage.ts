import * as SecureStore from "expo-secure-store";

export async function saveToSecureStore(key: string, value: string) {
  await SecureStore.setItemAsync(key, value);
}

export async function getFromSecureStore(key: string) {
  return SecureStore.getItemAsync(key);
}

export async function deleteFromSecureStore(key: string) {
  await SecureStore.deleteItemAsync(key);
}

export async function saveJsonToSecureStore<T>(key: string, value: T) {
  await saveToSecureStore(key, JSON.stringify(value));
}

export async function getJsonFromSecureStore<T>(key: string) {
  const value = await getFromSecureStore(key);
  return value ? (JSON.parse(value) as T) : null;
}
