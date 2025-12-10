import React from 'react';
import { View, Text } from 'react-native';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export default function TitledText({children, title}) {
  const {mutedWidgetButtonTextStyle} = useCompanyTheme();

  return (
    <View className="flex">
      <Text className='font-bold text-[12px]' style={mutedWidgetButtonTextStyle}>{title}</Text>
      <Text className="mr-2 mt-1 text-[14px]">{children}</Text>
    </View>
  )
}