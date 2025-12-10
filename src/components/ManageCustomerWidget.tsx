import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function ManageCustomerWidget({navigation}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async () => {
    navigation.navigate('ManageCustomers');
  };

  return (
    <HomeWidget 
      uniqKey={"manage-customer-widget"}
      icon={"star-outline"} 
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress()}>Manage Customers</HomeWidget>
  )
}