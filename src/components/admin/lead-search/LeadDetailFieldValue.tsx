import React from "react";
import { Text, View } from "react-native";

export default function LeadDetailFieldValue({children, label, multiline = false}) {
  return (
    <View className={`mb-2 ${multiline ? '' : 'flex-row'}`}>
      <Text className="font-semibold mr-1">{label}:</Text>
      <Text selectable={true}>{children}</Text>
    </View>
  )
}