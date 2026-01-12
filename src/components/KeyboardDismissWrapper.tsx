import React from "react";
import { Platform, TouchableWithoutFeedback, Keyboard, View } from "react-native";

export function KeyboardDismissWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS === "web") {
    return <View style={{ flex: 1 }}>{children}</View>;
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ flex: 1 }}>{children}</View>
    </TouchableWithoutFeedback>
  );
}
