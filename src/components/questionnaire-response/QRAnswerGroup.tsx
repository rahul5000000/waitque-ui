import React from "react";
import { Text, View } from "react-native";
import QRAnswers from "./QRAnswers";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function QRAnswerGroup({children, questions}) {
  const {primaryButtonTextStyle, cardStyle} = useCompanyTheme();

  return (
    <View className="p-4 my-4" style={cardStyle}>
      <Text className="text-[20px] font-bold" style={primaryButtonTextStyle}>{children}</Text>
      <QRAnswers questions={questions}></QRAnswers>
    </View>
  )
}