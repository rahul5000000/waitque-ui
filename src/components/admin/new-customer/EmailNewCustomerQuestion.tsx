import React from "react";
import { TextInput, View } from "react-native";
import { useCompanyTheme } from "../../../hooks/useCompanyTheme";
import NewCustomerQuestionText from "./NewCustomerQuestionText";

export default function EmailNewCustomerQuestion({children, isRequired = false, value, onChange, hasValidationError}) {
  const {textInputStyle} = useCompanyTheme();

  return (
      <View className="flex">
        <NewCustomerQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</NewCustomerQuestionText>
        <TextInput autoComplete="off" inputMode="email" keyboardType="email-address" style={textInputStyle} onChangeText={onChange} value={value}/>
      </View>
    )
}