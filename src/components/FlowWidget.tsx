import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export default function FlowWidget({navigation, flow}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (flow) => {
    try {
      // const response = await api.post('/lead', { service });
      // console.log('Lead created:', response.data);
      console.log(flow);
      navigation.navigate('LeadEntry', { flow });
    } catch (error) {
      console.error('API error:', error);
    }
  };

  return (
    <TouchableOpacity
      key={flow.id}
      className="w-36 h-32 rounded-xl items-center justify-center" style={widgetBackgroundStyle}
      onPress={() => handleServicePress(flow)}
    >
      <Ionicons name={flow.icon} size={36} style={widgetButtonTextStyle} />
      <Text className="text-base mt-2" style={widgetButtonTextStyle}>{flow.name}</Text>
    </TouchableOpacity>
  )
}