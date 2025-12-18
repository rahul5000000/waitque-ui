import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function FlowWidget({navigation, flow}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (flow) => {
    navigation.navigate('LeadEntry', { flow });
  };

  return (
    <HomeWidget 
      uniqKey={flow.id}
      icon={flow.icon} 
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress(flow)}>{flow.name}</HomeWidget>
  )
}