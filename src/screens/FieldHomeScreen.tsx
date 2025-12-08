import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from "../hooks/useCompanyTheme";import SettingsWidget from "../components/SettingsWidget";
;

export default function FieldHomeScreen({navigation}) {
  const {colors} = useCompanyTheme();

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1">
        <View className="p-8">
          <Text className="text-3xl font-semibold mb-4">Field Home Screen</Text>
          <SettingsWidget navigation={navigation} />
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}