import React from "react";
import LeadDetailFieldValue from "./LeadDetailFieldValue";
import { View, Text, Image } from "react-native";

export default function LeadDetailImageFieldValue({answer, question, cdnBaseUrl}) {
  return (
    <View className="mb-2">
      <Text className="font-semibold mr-1 mb-2">{question.question}:</Text>
      <Image source={{ uri: cdnBaseUrl + "/" + answer.url }} className="h-48 rounded-xl" />
    </View>
  );
}