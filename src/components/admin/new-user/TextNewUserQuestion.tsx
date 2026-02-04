import React from "react";
import { TextInput, View } from "react-native";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import NewUserQuestionText from "./NewUserQuestionText";

export default function TextNewUserQuestion({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <NewUserQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</NewUserQuestionText>
        <TextInput style={textInputStyle} onChangeText={onChange} value={value}/>
      </View>
    )
}