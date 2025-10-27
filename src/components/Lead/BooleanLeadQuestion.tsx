import React, {useState} from "react";
import LeadQuestionText from "./LeadQuestionText";
import { Switch, Text, View } from "react-native";

export default function BooleanLeadQuestion({children, isRequired = false, falseText = null, trueText = null, value, onChange, hasValidationError}) {
  const toggleSwitch = () => onChange(!value);

  return (
    <View className="flex">
      <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
      <View className="flex-row">
        {falseText ? <Text className="mr-2 mt-1 text-[12px]">{falseText}</Text> : ""}
        <Switch onValueChange={toggleSwitch} value={value}></Switch>
        {trueText ? <Text className="ml-2 mt-1 text-[12px]">{trueText}</Text> : ""}
      </View>
    </View>
  )
}