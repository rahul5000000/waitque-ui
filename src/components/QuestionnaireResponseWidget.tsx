import React from 'react';
import { useCompanyTheme } from '../hooks/useCompanyTheme';
import HomeWidget from './HomeWidget';

export default function QuestionnaireResponseWidget({navigation, questionnaireResponse}) {
  const {questionnaireWidgetButtonTextStyle, questionnaireWidgetBackgroundStyle} = useCompanyTheme();

  const handleServicePress = async (questionnaireResponse) => {
    console.log(questionnaireResponse);
    navigation.navigate('QuestionnaireResponseDetailView', { questionnaireResponse });
  };

  return (
    <HomeWidget
          uniqKey={questionnaireResponse.id}
          icon="glasses-outline"
          textStyle={questionnaireWidgetButtonTextStyle} 
          backgroundStyle={questionnaireWidgetBackgroundStyle} 
          onPress={() => handleServicePress(questionnaireResponse)}>View {questionnaireResponse.questionnaireName}</HomeWidget>
  )
}