import React from "react";
import TextQRAnswer from "./TextQRAnswer";
import { Text, View } from "react-native";
import BooleanQRAnswer from "./BooleanQRAnswer";
import PhoneNumberQRAnswer from "./PhoneNumberQRAnswer";

export default function QRAnswers({questions}) {
  return (
    <View className="border-1px border-solid">
      {questions.map((question) => {
        switch(question.dataType) {
          case "BOOLEAN": return (<BooleanQRAnswer key={question.id} enabled={false} falseText={question.falseText} trueText={question.trueText}>{question.question}</BooleanQRAnswer>)
          case "PHONE": return (<PhoneNumberQRAnswer key={question.id} value="1234">{question.question}</PhoneNumberQRAnswer>)
          case "IMAGE": return null
          default: return (<TextQRAnswer key={question.id} value="abc">{question.question}</TextQRAnswer>)
        }
      })}
    </View>
  )
}