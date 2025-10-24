import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../../App';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import FlowWidget from '../components/FlowWidget';
import { useAppContext } from '../hooks/AppContext';
import { PrimaryButton, SecondaryButton } from '../components/Buttons';
import Header from '../components/Header';
import ContactWidget from '../components/ContactWidget';


export default function HomeScreen({ navigation, route }) {
  const {company, customer, flows} = useAppContext();
  const {backgroundStyle, textStyle} = useCompanyTheme();

  return (
    <SafeAreaView className="flex-1" style={backgroundStyle}>
      <View className="p-8 flex-1">
        <View className='mt-6 mb-12 flex'>
          <Text className="text-2xl font-semibold" style={textStyle}>Hi {customer.firstName} {customer.lastName},</Text>
          <Text className="text-2xl font-semiboldmb-6" style={textStyle}>
            {company.landingPrompt}
          </Text>
        </View>

        <View className='flex-1'>
          <View className="flex-row flex-wrap justify-center gap-4 mb-8">
            {flows.leadFlows.map((flow) => (
              <FlowWidget navigation={navigation} flow={flow}></FlowWidget>
            ))}
            {flows.leadFlows.length % 2 == 1 ? <View className="w-36 h-32 rounded-xl items-center justify-center"></View> : "" /* Hack to left align widgets but keep container centered*/ } 
          </View>
        </View>

        <View className='mt-auto flex'>
          <ContactWidget></ContactWidget>
        </View>
      </View>
    </SafeAreaView>
  );
}