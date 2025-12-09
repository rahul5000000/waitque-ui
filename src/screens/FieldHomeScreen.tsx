import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCompanyTheme } from "../hooks/useCompanyTheme";import SettingsWidget from "../components/SettingsWidget";
import Logo from "../components/Logo";
import { useAppContext } from "../hooks/AppContext";
import ManageCustomerWidget from "../components/ManageCustomerWidget";
;

export default function FieldHomeScreen({navigation}) {
  const {colors} = useCompanyTheme();
  const {backgroundStyle, textStyle} = useCompanyTheme();
  const {user} = useAppContext();

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View style={{ flex: 1, padding: 24 }}>
        <View className='flex-row mb-10 mt-2'>
          <View className='flex-2 items-start justify-center'>
            <Text className="text-2xl font-semibold" style={textStyle}>
              Hi {`${user.firstName} ${user.lastName}`}!
            </Text>
          </View>
          <View className='flex-1 items-end justify-center'>
            <Logo/>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <View className="flex-row flex-wrap justify-center gap-4 mb-8">
            <ManageCustomerWidget navigation={navigation} />
            <SettingsWidget navigation={navigation} />
            {(1 + 1) % 2 === 1 ? (
              <View className="w-36 h-32 rounded-xl" />
            ) : null}
          </View>
        </View>
      </View>
    </SafeAreaView>
  )
}