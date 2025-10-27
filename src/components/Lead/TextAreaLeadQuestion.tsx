import React from "react";
import { TextInput, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function TextAreaLeadQuestion({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
        <TextInput style={textInputStyle} onChangeText={onChange} multiline numberOfLines={4} maxLength={1000} value={value}/>
      </View>
    )
}