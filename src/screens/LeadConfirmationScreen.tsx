import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from "../components/Header";
import { Ionicons } from "@expo/vector-icons";
import { useCompanyTheme } from "../hooks/useCompanyTheme";
import Logo from "../components/Logo";

export default function LandingScreen({navigation, route}) {
  const {flowDetails} = route.params;
  const {colors} = useCompanyTheme();

  return (
    <SafeAreaView className='flex-1'>
      <ScrollView className="flex-1">
        <View className="p-8">
          <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>{flowDetails.confirmationMessageHeader}</Header>
          <View className="items-center mt-12">
            <Logo size={'large'}/>
          </View>
          {flowDetails.confirmationMessage1 ? 
          <View className="flex-row justify-center m-8 my-12">
            <Text className="text-3xl font-semibold">{flowDetails.confirmationMessage1}</Text>
          </View> 
          : null}
          { flowDetails.confirmationMessage2 && flowDetails.confirmationMessage3 ?
          <View className="my-8">
            {flowDetails.confirmationMessage2 ?
            <View className="flex-row my-4">
              <Ionicons name="checkmark-circle" size={32} className="mr-2" color={colors.primaryButtonColor}></Ionicons><Text className="text-xl">{flowDetails.confirmationMessage2}</Text>
            </View> 
            : null
            }
            {flowDetails.confirmationMessage3 ?
            <View className="flex-row">
              <Ionicons name="checkmark-circle" size={32} className="mr-2" color={colors.primaryButtonColor}></Ionicons><Text className="text-xl">{flowDetails.confirmationMessage3}</Text>
            </View> 
            : null
            }
          </View> 
          : null
          }
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}