import React from "react";
import { TextInput, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function TextLeadQuestion({children, isRequired = false}) {
  const {textInputStyle} = useCompanyTheme();
  const [text, onChangeText] = React.useState('');

  return (
      <View className="flex">
        <LeadQuestionText isRequired={isRequired}>{children}</LeadQuestionText>
        <TextInput style={textInputStyle} onChangeText={onChangeText} value={text}/>
      </View>
    )
}