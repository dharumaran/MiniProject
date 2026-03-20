import React, { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { apiFetch } from "../utils/api";
import { getSession, saveSession } from "../utils/session";
import type { User } from "../utils/types";

interface UpdateUpiResponse {
  success: boolean;
  message: string;
  user: User;
}

function maskAccountNumber(accountNo: string) {
  return accountNo.slice(-4);
}

export default function SetupUpi() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [upiId, setUpiId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadSession = async () => {
      const session = await getSession();
      if (!session?.user) {
        router.replace("/login");
        return;
      }

      setUser(session.user);
      setUpiId(session.user.upiId || "");
    };

    void loadSession();
  }, [router]);

  const handleSaveUpi = async () => {
    if (!user?.accountNo) {
      router.replace("/login");
      return;
    }

    if (!upiId.trim()) {
      Alert.alert("Missing UPI ID", "Please enter a UPI ID to continue.");
      return;
    }

    setIsSaving(true);

    try {
      const data = await apiFetch<UpdateUpiResponse>("/auth/upi", {
        method: "PATCH",
        body: JSON.stringify({
          accountNo: user.accountNo,
          upiId,
        }),
      });

      await saveSession(data.user);
      Alert.alert("UPI linked", data.message, [
        {
          text: "Continue",
          onPress: () => router.replace("/dashboard"),
        },
      ]);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not save UPI ID.";
      Alert.alert("UPI setup failed", message);
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading account...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Set Your UPI ID</Text>
        <Text style={styles.subtitle}>
          This UPI ID will be linked to account ending in {maskAccountNumber(user.accountNo)}.
        </Text>

        <TextInput
          style={styles.input}
          placeholder="example@upi"
          placeholderTextColor="#64748b"
          value={upiId}
          onChangeText={setUpiId}
          autoCapitalize="none"
        />

        <TouchableOpacity
          style={[styles.primaryButton, isSaving && styles.buttonDisabled]}
          onPress={() => void handleSaveUpi()}
          disabled={isSaving}
        >
          <Text style={styles.buttonText}>
            {isSaving ? "Saving..." : "Save UPI ID"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    color: "#cbd5e1",
    fontSize: 16,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    borderRadius: 20,
    padding: 28,
    backgroundColor: "#111827",
    borderWidth: 1,
    borderColor: "#1f2937",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#f8fafc",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    color: "#94a3b8",
    textAlign: "center",
    marginBottom: 22,
  },
  input: {
    backgroundColor: "#020617",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    color: "#f8fafc",
    paddingHorizontal: 14,
    paddingVertical: 14,
    marginBottom: 14,
    fontSize: 15,
  },
  primaryButton: {
    backgroundColor: "#2563eb",
    borderRadius: 12,
    alignItems: "center",
    paddingVertical: 15,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 16,
  },
});
