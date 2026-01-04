import React from "react";
import { TextInput, View, Text } from "react-native";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import EditQRAnswerText from "./EditQRAnswerText";

export default function EditTextQRAnswer({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <EditQRAnswerText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</EditQRAnswerText>
        <TextInput style={textInputStyle} onChangeText={onChange} value={value}/>
      </View>
    )
}