import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export function PrimaryButton({children, onPress, isWorking = false}) {
  const {primaryButtonStyle, primaryButtonTextStyle} = useCompanyTheme();
  return Button(children, primaryButtonStyle, primaryButtonTextStyle, onPress, isWorking);
}

export function SecondaryButton({children, onPress, isWorking = false}) {
  const {secondaryButtonStyle, secondaryButtonTextStyle} = useCompanyTheme();
  return Button(children, secondaryButtonStyle, secondaryButtonTextStyle, onPress, isWorking);
}

export function WarningButton({children, onPress, isWorking = false}) {
  const {warningButtonStyle, warningButtonTextStyle} = useCompanyTheme();
  return Button(children, warningButtonStyle, warningButtonTextStyle, onPress, isWorking);
}

function Button(text, buttonStyle, textStyle, onPress, isWorking) {
  return (
    <TouchableOpacity onPress={onPress} disabled={isWorking} className={`bg-blue-800 py-4 rounded-lg my-2 items-center ${isWorking ? 'opacity-50' : ''}`} style={buttonStyle}>
      <View className='flex-row'>
        {isWorking && (
          <ActivityIndicator
            size="small"
            color={textStyle.color}
            className="mr-2"
          />
        )}
      <Text className="text-base font-semibold" style={textStyle}>{text}</Text>
      </View>
    </TouchableOpacity>
  )
}