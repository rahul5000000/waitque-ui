import React from "react";
import TextQRAnswer from "./TextQRAnswer";
import { Text, View } from "react-native";
import BooleanQRAnswer from "./BooleanQRAnswer";
import PhoneNumberQRAnswer from "./PhoneNumberQRAnswer";

export default function QRAnswers({questions, answers}) {
  return (
    <View className="border-1px border-solid">
      {questions.map((question) => {
        const answer = answers.find(a => a.questionnaireQuestionId === question.id);

        if(answer && answer.dataType === question.dataType) {
          switch(question.dataType) {
            case "BOOLEAN": return (<BooleanQRAnswer key={question.id} enabled={answer.enabled} falseText={question.falseText} trueText={question.trueText}>{question.question}</BooleanQRAnswer>)
            case "PHONE": return (<PhoneNumberQRAnswer key={question.id} value={answer.phoneNumber}>{question.question}</PhoneNumberQRAnswer>)
            case "TEXT": return (<TextQRAnswer key={question.id} value={answer.text}>{question.question}</TextQRAnswer>)
            case "NUMBER": return (<TextQRAnswer key={question.id} value={answer.number}>{question.question}</TextQRAnswer>)
            case "DECIMAL": return (<TextQRAnswer key={question.id} value={answer.decimal}>{question.question}</TextQRAnswer>)
            case "TEXTAREA": return (<TextQRAnswer key={question.id} value={answer.paragraph}>{question.question}</TextQRAnswer>)
            case "EMAIL": return (<TextQRAnswer key={question.id} value={answer.email}>{question.question}</TextQRAnswer>)
            case "IMAGE": return null
            default: return null
          }
        } else {
          return null;
        }
      })}
    </View>
  )
}