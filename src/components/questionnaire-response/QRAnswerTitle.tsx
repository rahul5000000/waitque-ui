import React from "react";
import { Text, View } from "react-native";

export default function QRAnswerTitle({children}) {
  return (
    <View className="flex-row my-2 mt-5">
      <Text className="text-[14px] font-semibold">{children}:</Text>
    </View>
  )
}