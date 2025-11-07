import React from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import QRAnswerGroup from '../components/questionnaire-response/QRAnswerGroup';
import QRAnswers from '../components/questionnaire-response/QRAnswers';
import { useCompanyTheme } from '../hooks/useCompanyTheme';

export default function QuestionnaireResponsePageViewScreen({route, navigation}) {
  const { page, questionnaireResponse, answers } = route.params;
  const {backgroundStyle} = useCompanyTheme();

  const handleGoBack = async (questionnaireResponse) => {
    navigation.navigate('QuestionnaireResponseDetailView', { questionnaireResponse });
  };

  return (
    <SafeAreaView style={[backgroundStyle, { flex: 1 }]}>
      <View className="p-8 flex-1">
        <View className='flex-1'>
          <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack(questionnaireResponse)}>{questionnaireResponse.questionnaireName} / {page.pageTitle}</Header>
          <ScrollView className='mt-2 flex-1'>
            {<QRAnswers questions={page.questions.filter((question) => !question.questionGroup)} answers={answers}></QRAnswers>}
            {Object.entries(page.questions.filter((question) => question.questionGroup).reduce((groups, question) => {
                const group = question.questionGroup;
                if (!groups[group]) {
                  groups[group] = [];
                }
                groups[group].push(question);
                return groups;
              }, {})).map(([groupName, questions]) => ({groupName, questions})).map((groupedQuestions) => {
                return (<QRAnswerGroup key={groupedQuestions.groupName} questions={groupedQuestions.questions} answers={answers.filter(answer => (groupedQuestions.questions as any[]).some(q => q.id === answer.questionnaireQuestionId))}>{groupedQuestions.groupName}</QRAnswerGroup>)
              })
            }
          </ScrollView>
        </View>
      </View>
    </SafeAreaView>
  )
}