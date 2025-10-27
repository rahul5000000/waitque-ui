import React from "react";
import { TextInput, View, Text } from "react-native";
import LeadQuestionText from "./LeadQuestionText";
import { useCompanyTheme } from "../../hooks/useCompanyTheme";

export default function DecimalLeadQuestion({ children, isRequired = false, value, onChange, hasValidationError }) {
  const { textInputStyle } = useCompanyTheme();
  const [displayTypeError, setDisplayTypeError] = React.useState(false);
  const errorTimerRef = React.useRef(null);

  const handleChange = (text) => {
    // Remove any non-digit characters
    const onlyNums = text.replace(/[^0-9.]/g, '');

    if(onlyNums !== text) {
      setDisplayTypeError(true);

      // Clear existing timer if user keeps typing invalid input
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }

      // Start a new 5-second timer
      errorTimerRef.current = setTimeout(() => {
        setDisplayTypeError(false);
        errorTimerRef.current = null;
      }, 3000);
    }

    onChange(onlyNums);
  };

  React.useEffect(() => {
    return () => {
      if (errorTimerRef.current) {
        clearTimeout(errorTimerRef.current);
      }
    };
  }, []);

  return (
    <View className="flex">
      <View className="flex-row">
        <LeadQuestionText isRequired={isRequired} hasValidationError={hasValidationError}>{children}</LeadQuestionText>
        {displayTypeError ? <Text className="m-2 text-red-500 animate-pulse">(enter decimal numbers only)</Text> : null}
      </View>
      <TextInput
          style={textInputStyle}
          onChangeText={handleChange}
          value={value}
          keyboardType="decimal-pad"
          inputMode="decimal" // Helps on web or newer React Native versions
        />
    </View>
  );
}
