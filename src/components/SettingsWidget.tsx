import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function SettingsWidget({navigation}) {
  const {mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle} = useCompanyTheme();

  const handleServicePress = async () => {
    navigation.navigate('Settings');
  };

  return (
    <HomeWidget
          uniqKey={"settings-widget"}
          icon="settings-outline"
          textStyle={mutedWidgetButtonTextStyle} 
          backgroundStyle={mutedWidgetBackgroundStyle} 
          onPress={() => handleServicePress()}>Settings</HomeWidget>
  )
}