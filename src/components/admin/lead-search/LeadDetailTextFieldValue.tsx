import React from "react";
import LeadDetailFieldValue from "./LeadDetailFieldValue";
import { View } from "react-native";

export default function LeadDetailTextFieldValue({answer, question}) {
  return (
    <View>
      <LeadDetailFieldValue label={question.question} multiline={true}>{answer.text}</LeadDetailFieldValue>
    </View>
  );
}