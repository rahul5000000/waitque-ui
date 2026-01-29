import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

export default function AlertWidget({children, icon=null, iconStyle=null, uniqKey, backgroundStyle=null, onPress=null}) {
  return (
    <TouchableOpacity
      key={uniqKey}
      onPress={onPress}
      className="rounded-lg items-center justify-center p-3 mx-2"
      style={backgroundStyle}
    >
      <View className="flex-row align-items-center">
        {icon ? <Ionicons name={icon} size={18} className='mr-2' style={iconStyle}/> : null}
        <Text className="text-base text-center">{children}</Text>
      </View>
    </TouchableOpacity>
  )
}