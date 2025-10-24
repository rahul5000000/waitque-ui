import React from "react";
import { TextInput, View } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function TextAreaLeadQuestion({children, isRequired = false}) {
  const {textInputStyle} = useCompanyTheme();
  const [text, onChangeText] = React.useState('');

  return (
      <View className="flex">
        <LeadQuestionText isRequired={isRequired}>{children}</LeadQuestionText>
        <TextInput style={textInputStyle} onChangeText={onChangeText} multiline numberOfLines={4} maxLength={1000} value={text}/>
      </View>
    )
}