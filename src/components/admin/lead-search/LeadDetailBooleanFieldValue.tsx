import React from "react";
import LeadDetailFieldValue from "./LeadDetailFieldValue";
import { View } from "react-native";

export default function LeadDetailBooleanFieldValue({answer, question}) {
  const getBooleanText = (value: boolean) => {
    if(question.falseText && question.trueText) {
      return value ? question.trueText : question.falseText;
    }
    return value ? "Yes" : "No";
  }

  return (
    <View>
      <LeadDetailFieldValue label={question.question} multiline={true}>{getBooleanText(answer.enabled)}</LeadDetailFieldValue>
    </View>
  );
}