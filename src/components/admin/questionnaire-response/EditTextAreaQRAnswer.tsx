import React from "react";
import { TextInput, View } from "react-native";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import EditQRAnswerText from "./EditQRAnswerText";

export default function EditTextAreaQRAnswer({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <EditQRAnswerText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</EditQRAnswerText>
        <TextInput style={[textInputStyle, {minHeight: 100, textAlignVertical: "top"}]} onChangeText={onChange} multiline numberOfLines={4} maxLength={1000} value={value}/>
      </View>
    )
}