import React from 'react';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import HomeWidget from '../HomeWidget';

export default function GenerateQRCodeWidget({navigation}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async () => {
    navigation.navigate('GenerateQRCodesPage');
  };

  return (
    <HomeWidget 
      uniqKey={"generate-qr-code-widget"}
      icon="qr-code-outline"
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress()}>Generate QR Codes</HomeWidget>
  )
}