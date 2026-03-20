import { Slot } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import GestureWrapper from "../components/GestureWrapper";

export default function Layout() {
  return (
    <GestureWrapper>
      <SafeAreaView style={{ flex: 1 }}>
        <Slot />
      </SafeAreaView>
    </GestureWrapper>
  );
}
