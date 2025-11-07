import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function HomeWidget({children, uniqKey, icon = null, textStyle, backgroundStyle, onPress}) {

  return (
    <TouchableOpacity
      key={uniqKey}
      className="w-36 h-32 rounded-xl items-center justify-center p-4" style={backgroundStyle}
      onPress={onPress}
    >
      {icon ? <Ionicons name={icon} size={36} style={textStyle} /> : null}
      <Text className="text-base mt-2 text-center" style={textStyle}>{children}</Text>
    </TouchableOpacity>
  )
}