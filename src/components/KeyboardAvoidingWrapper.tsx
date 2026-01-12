import React from "react";
import { Platform, KeyboardAvoidingView, ScrollView } from "react-native";

export function KeyboardAvoidingWrapper({ children }: { children: React.ReactNode }) {
  if (Platform.OS === "web") {
    return <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>;
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

