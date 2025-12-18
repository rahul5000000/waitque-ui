import React from 'react';
import { useCompanyTheme } from '../../hooks/useCompanyTheme';
import { Text } from "react-native";
import { TouchableOpacity } from 'react-native';

export default function QuestionnaireResponsePageStatusWidget({navigation, customerMetadata, questionnairePage, questionnaireResponse, answers, questionnaireId, cdnBaseUrl, saveUpdatedQuestionnaireResponseCallback}) {
  const {widgetButtonTextStyle, widgetBackgroundStyle, widgetButtonLighterTextStyle} = useCompanyTheme();

  const handleServicePress = async (page, questionnaireResponse, answers, questionnaireId, cdnBaseUrl) => {
    navigation.navigate('EditQuestionnairePage', { customerMetadata, page, questionnaireResponse, answers, questionnaireId, cdnBaseUrl, saveUpdatedQuestionnaireResponse });
  };

  const getAnsweredRatio = () => {
    let numAnswered = 0;

    if(answers) {
      numAnswered = answers.length;
    }

    return `Answered: ${numAnswered}/${questionnairePage.questions.length}`
  }

  const saveUpdatedQuestionnaireResponse = (questionnaireResponse) => {
    if(saveUpdatedQuestionnaireResponseCallback) {
      saveUpdatedQuestionnaireResponseCallback(questionnaireResponse);
    }
  }

  return (
    <TouchableOpacity
      key={questionnairePage.id}
      className="w-36 h-32 rounded-xl items-center justify-center p-4" style={widgetBackgroundStyle}
      onPress={() => handleServicePress(questionnairePage, questionnaireResponse, answers, questionnaireId, cdnBaseUrl)}
    >
      <Text className="text-base mt-2 text-center" style={widgetButtonTextStyle}>Edit {questionnairePage.pageTitle}</Text>
      <Text className='text-xs mt-1' style={widgetButtonLighterTextStyle}>{getAnsweredRatio()}</Text>
    </TouchableOpacity>
  )
}