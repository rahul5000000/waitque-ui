import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function SettingsWidget({navigation, onPress}) {
  const {mutedWidgetBackgroundStyle, mutedWidgetButtonTextStyle} = useCompanyTheme();

  return (
    <HomeWidget
          uniqKey={"settings-widget"}
          icon="settings-outline"
          textStyle={mutedWidgetButtonTextStyle} 
          backgroundStyle={mutedWidgetBackgroundStyle} 
          onPress={onPress}>Settings</HomeWidget>
  )
}