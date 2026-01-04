import React, { useEffect, useState } from 'react';
import { View, Text, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAppContext } from '../hooks/AppContext';
import axios from 'axios';
import Spinner from '../components/Spinner';
import Header from '../components/Header';
import QuestionnaireResponsePageWidget from '../components/QuestionnaireResponsePageWidget';
import { publicService } from '../services/backend/publicService';
import { logError } from '../services/mobileLogger';
import Toast from 'react-native-toast-message';

export default function QuestionnaireResponseDetailViewScreen({route, navigation}) {
  const { questionnaireResponse } = route.params;
  const { qrCode } = useAppContext();

  const [questionnaireResponseDetails, setQuestionnaireResponseDetails] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [pagesWithAnswers, setPagesWithAnswers] = useState(null);

  useEffect(() => {
      const fetchQuestionnaireResponseDetails = async () => {
        try {
          const [qrDetailResponse] = await Promise.all([
            publicService.getQuestionnaireResponse(qrCode, questionnaireResponse.id),
          ]);
  
          setQuestionnaireResponseDetails(qrDetailResponse.data);

          const answeredQuestionIds = qrDetailResponse.data.answers.map(answer => answer.questionnaireQuestionId);

          const pagesWithAnswers = qrDetailResponse.data.questionnaire.pages
            .filter(page => 
              page.questions.some(question => answeredQuestionIds.includes(question.id))
            )
            .sort((a, b) => a.pageNumber - b.pageNumber);

          setPagesWithAnswers(pagesWithAnswers);
        } catch (error) {
          logError({
            qrCode,
            page: 'QuestionnaireResponseDetailViewScreen',
            message: 'Failed to fetch questionnaire response details',
            error,
          }).catch(() => {
            // swallow errors from logger
          });

          Toast.show({
            type: 'error',
            text1: 'Failed to load data',
            text2: 'Please try again later',
          });

          navigation.goBack();
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
                <Header icon="arrow-back-outline" iconOnPress={() => navigation.goBack()}>{questionnaireResponseDetails.questionnaire.name}</Header>
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
                      cdnBaseUrl={questionnaireResponseDetails.cdnBaseUrl}
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