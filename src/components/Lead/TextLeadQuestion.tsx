import React from "react";
import { TextInput, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function TextLeadQuestion({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
        <TextInput style={textInputStyle} onChangeText={onChange} value={value}/>
      </View>
    )
}