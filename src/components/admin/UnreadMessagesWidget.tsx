import React from 'react';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import HomeWidget from '../HomeWidget';

export default function UnreadMessagesWidget({navigation, unreadMessagesCount, dashboardRefreshCallback}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async () => {
    navigation.navigate('MessageSearchPage', {dashboardRefreshCallback});
  };

  const getWidgetTitle = () => {
    if(unreadMessagesCount === 1) {
      return "Unread Message";
    } else {
      return "Unread Messages";
    }
  }

  return (
    <HomeWidget 
      uniqKey={"unread-messages-widget"}
      metric={unreadMessagesCount + ""}
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress()}>{getWidgetTitle()}</HomeWidget>
  )
}