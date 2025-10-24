import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export function PrimaryButton({children, onPress}) {
  const {primaryButtonStyle, primaryButtonTextStyle} = useCompanyTheme();
  return Button(children, primaryButtonStyle, primaryButtonTextStyle, onPress);
}

export function SecondaryButton({children, onPress}) {
  const {secondaryButtonStyle, secondaryButtonTextStyle} = useCompanyTheme();
  return Button(children, secondaryButtonStyle, secondaryButtonTextStyle, onPress);
}

export function WarningButton({children, onPress}) {
  const {warningButtonStyle, warningButtonTextStyle} = useCompanyTheme();
  return Button(children, warningButtonStyle, warningButtonTextStyle, onPress);
}

function Button(text, buttonStyle, textStyle, onPress) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-blue-800 py-4 rounded-lg my-2 items-center" style={buttonStyle}>
      <Text className="text-base font-semibold" style={textStyle}>{text}</Text>
    </TouchableOpacity>
  )
}