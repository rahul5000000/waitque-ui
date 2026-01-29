import React from "react";
import LeadDetailFieldValue from "./LeadDetailFieldValue";
import { View } from "react-native";

export default function LeadDetailNumberFieldValue({answer, question}) {
  return (
    <View>
      <LeadDetailFieldValue label={question.question} multiline={true}>{answer.number}</LeadDetailFieldValue>
    </View>
  );
}