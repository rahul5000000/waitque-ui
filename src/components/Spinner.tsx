import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

export default function Spinner({message = "Loading", spinnerColor = null, textColor = null}) {
  return (
    <View className="items-center justify-center">
      {spinnerColor ? <ActivityIndicator size="large" color={spinnerColor}></ActivityIndicator> : <ActivityIndicator size="large"></ActivityIndicator>}
      {textColor ? <Text className="mt-4 animate-pulse" style={{color: textColor}}>{message}</Text> : <Text className="mt-4 animate-pulse text-gray-600">{message}</Text>}
    </View>
  )
}