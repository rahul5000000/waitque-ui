import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export default function Header({children, icon = null, iconOnPress = null, logoUrl = null}) {
  const {textStyle} = useCompanyTheme();

  return (
    <View className="flex-row">
      {icon ? <Ionicons size={26} name={icon} onPress={iconOnPress}></Ionicons> : ""}
      <Text className="text-lg font-semibold ml-2" style={textStyle}>{children}</Text>
    </View>
  )
}