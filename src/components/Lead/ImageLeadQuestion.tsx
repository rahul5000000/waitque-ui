import React from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";
import { Ionicons } from "@expo/vector-icons";

export default function ImageLeadQuestion({ children, isRequired = false, value, onChange, hasValidationError }) {
  const { mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle } = useCompanyTheme();

  return (
    <View className="flex">
      <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
      <TouchableOpacity
        className="rounded-xl items-center justify-center p-12" style={mutedWidgetBackgroundStyle}
      >
        <Ionicons name="camera" size={30} style={mutedWidgetButtonTextStyle} />
      </TouchableOpacity>
    </View>
)
}