import React from "react";
import { Text, View } from "react-native";

export default function NewUserQuestionText({children, isRequired = false, hasValidationError}) {
  return (
    <View className="flex-row my-2 mt-5">
      {hasValidationError ? <Text className="text-[12px]" style={{color: "red"}}>{children}</Text> : <Text className="text-[12px]">{children}</Text>}
      {isRequired ? <Text style={{color: "red"}}>*</Text> : null}
    </View>
  )
}