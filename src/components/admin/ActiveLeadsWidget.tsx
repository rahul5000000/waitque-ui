import React from 'react';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import HomeWidget from '../HomeWidget';

export default function ActiveLeadsWidget({navigation, activeLeadsCount, dashboardRefreshCallback}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async () => {
    navigation.navigate('LeadSearchPage', {dashboardRefreshCallback});
  };

  const getWidgetTitle = () => {
    if(activeLeadsCount === 1) {
      return "Active Lead";
    } else {
      return "Active Leads";
    }
  }

  return (
    <HomeWidget 
      uniqKey={"active-leads-widget"}
      metric={(activeLeadsCount || 0) + ""}
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress()}>{getWidgetTitle()}</HomeWidget>
  )
}