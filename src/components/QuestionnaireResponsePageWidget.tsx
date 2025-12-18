import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function QuestionnaireResponsePageWidget({navigation, questionnairePage, questionnaireResponse, answers, cdnBaseUrl}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (page, questionnaireResponse, answers, cdnBaseUrl) => {
    console.log(page);
    navigation.navigate('QuestionnairePageView', { page, questionnaireResponse, answers, cdnBaseUrl });
  };

  return (
    <HomeWidget 
      uniqKey={questionnairePage.id}
      textStyle={widgetButtonTextStyle} 
      backgroundStyle={widgetBackgroundStyle} 
      onPress={() => handleServicePress(questionnairePage, questionnaireResponse, answers, cdnBaseUrl)}>View {questionnairePage.pageTitle}</HomeWidget>
  )
}