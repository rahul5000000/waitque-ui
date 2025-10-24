import React from "react";
import { Text, View } from "react-native";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function LeadQuestionText({children, isRequired = false}) {
  const {dangerButtonTextStyle} = useCompanyTheme();

  return (
    <View className="flex-row my-2 mt-5">
      <Text className="text-[12px]">{children}:</Text>
      {isRequired ? <Text style={{color: "red"}}>*</Text> : ""}
    </View>
  )
}