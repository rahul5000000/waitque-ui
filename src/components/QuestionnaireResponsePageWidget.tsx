import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function QuestionnaireResponsePageWidget({navigation, questionnairePage, questionnaireResponse, answers}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (page, questionnaireResponse, answers) => {
    console.log(page);
    navigation.navigate('QuestionnairePageView', { page, questionnaireResponse, answers });
  };

  return (
    <HomeWidget 
      uniqKey={questionnairePage.id}
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress(questionnairePage, questionnaireResponse, answers)}>View {questionnairePage.pageTitle}</HomeWidget>
  )
}