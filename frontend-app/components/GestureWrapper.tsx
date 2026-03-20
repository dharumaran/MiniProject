import React, { useRef } from "react";
import { PanResponder, View } from "react-native";
import { useRouter } from "expo-router";

export default function GestureWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const longPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearLongPressTimeout = () => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      longPressTimeout.current = setTimeout(() => {
        router.replace("/fake-dashboard");
      }, 4000);
    },
    onPanResponderRelease: clearLongPressTimeout,
    onPanResponderTerminate: clearLongPressTimeout,
  });

  return (
    <View style={{ flex: 1 }} {...panResponder.panHandlers}>
      {children}
    </View>
  );
}
