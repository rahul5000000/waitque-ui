import React from "react";
import { Text, View } from "react-native";
import QRAnswers from "./QRAnswers";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function QRAnswerGroup({children, questions, answers, cdnBaseUrl}) {
  const {primaryButtonTextStyle, cardStyle} = useCompanyTheme();

  if (!answers || answers.length === 0) {
    return null;
  }

  return (
    <View className="p-4 my-4" style={cardStyle}>
      <Text className="text-[18px] font-bold" style={primaryButtonTextStyle}>{children}</Text>
      <QRAnswers questions={questions} answers={answers} cdnBaseUrl={cdnBaseUrl}></QRAnswers>
    </View>
  )
}