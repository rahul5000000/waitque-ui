import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../hooks/AppContext';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import QuestionnaireResponsePageWidget from '../components/QuestionnaireResponsePageWidget';

export default function QuestionnaireResponseDetailViewScreen({route, navigation}) {
  const { questionnaireResponse } = route.params;
  const { backendBaseUrl, qrCode } = useAppContext();

  const [questionnaireResponseDetails, setQuestionnaireResponseDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [pagesWithAnswers, setPagesWithAnswers] = useState(null);

  const handleGoBack = async () => {
    navigation.navigate('Home');
  };

  useEffect(() => {
      const fetchQuestionnaireResponseDetails = async () => {
        try {
          const [qrDetailResponse] = await Promise.all([
            axios.get(`${backendBaseUrl}/api/public/customers/qrCode/${qrCode}/questionnaires/*/responses/${questionnaireResponse.id}`),
          ]);
  
          console.log('Questionnaire Response Details:', qrDetailResponse.data);
  
          setQuestionnaireResponseDetails(qrDetailResponse.data);

          const answeredQuestionIds = qrDetailResponse.data.answers.map(answer => answer.questionnaireQuestionId);

          const pagesWithAnswers = qrDetailResponse.data.questionnaire.pages
            .filter(page => 
              page.questions.some(question => answeredQuestionIds.includes(question.id))
            )
            .sort((a, b) => a.pageNumber - b.pageNumber);

          console.log(pagesWithAnswers);

          setPagesWithAnswers(pagesWithAnswers);
        } catch (error) {
          console.error('Error fetching questionnaire response details:', error);
          Alert.alert('Error', 'Failed to load questionnaire response.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchQuestionnaireResponseDetails();
    }, [questionnaireResponse]);

  return (
    <SafeAreaView className='flex-1'>
      <View className="p-8 flex-1">
          {loading ? <Spinner message="Loading data"></Spinner> : 
            <View className='flex-1'>
              <View>
                <Header icon="arrow-back-outline" iconOnPress={() => handleGoBack()}>{questionnaireResponseDetails.questionnaire.name}</Header>
              </View>
              <ScrollView className="mt-8 flex-1" style={{ flex: 1 }}>
                <View className="flex-row flex-wrap justify-center gap-4 mb-8">
                  {pagesWithAnswers.map((page) => (
                    <QuestionnaireResponsePageWidget
                      key={page.id}
                      navigation={navigation}
                      questionnairePage={page}
                      questionnaireResponse={questionnaireResponse}
                      answers={questionnaireResponseDetails.answers}
                    />
                  ))}
                  {pagesWithAnswers.length % 2 === 1 ? (
                    <View className="w-36 h-32 rounded-xl" />
                  ) : null}
                </View>
              </ScrollView>
            </View>
          }
        </View>
    </SafeAreaView>
  )
}