import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function QuestionnaireResponsePageWidget({navigation, questionnairePage, questionnaireResponse}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (page, questionnaireResponse) => {
    console.log(page);
    navigation.navigate('QuestionnairePageView', { page, questionnaireResponse });
  };

  return (
    <HomeWidget 
      uniqKey={questionnairePage.id}
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress(questionnairePage, questionnaireResponse)}>View {questionnairePage.pageTitle}</HomeWidget>
  )
}