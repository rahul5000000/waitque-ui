import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export default function Header({children, icon = null, iconOnPress = null, logoUrl = null}) {
  const {textStyle} = useCompanyTheme();

  return (
    <View className="flex-row">
      {icon ? <TouchableOpacity onPress={iconOnPress}><Ionicons size={26} name={icon}></Ionicons></TouchableOpacity> : null}
      <Text className="text-lg font-semibold ml-2" style={textStyle}>{children}</Text>
    </View>
  )
}