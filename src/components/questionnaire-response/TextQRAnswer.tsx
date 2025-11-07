import React from "react";
import { Text, View } from "react-native";
import QRAnswerTitle from "./QRAnswerTitle";

export default function TextQRAnswer({children, value}) {
  return (
    <View className="flex">
      <QRAnswerTitle>{children}</QRAnswerTitle>
      <Text className="mr-2 mt-1 text-[14px]">{value}</Text>
    </View>
  )
}