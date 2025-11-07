import { Platform } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { Switch, Text, View } from "react-native";

export default function BooleanLeadQuestion({children, isRequired = false, falseText = null, trueText = null, value, onChange, hasValidationError}) {
  const toggleSwitch = () => onChange(!value);
  const textMarginTop = Platform.OS == "android" ? 15 : 1;

  return (
    <View className="flex">
      <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
      <View className="flex-row">
        {falseText ? <Text className="mr-2 text-[12px]" style={{marginTop: textMarginTop}}>{falseText}</Text> : null}
        <Switch onValueChange={toggleSwitch} value={value}></Switch>
        {trueText ? <Text className="ml-2 text-[12px]" style={{marginTop: textMarginTop}}>{trueText}</Text> : null}
      </View>
    </View>
  )
}